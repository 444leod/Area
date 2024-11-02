import {
  AreaPacket,
  RabbitMQService,
  MongoDBService,
  replaceField,
  ReactionInfos,
  ValidationError,
  Area,
} from "@area/shared";
import dotenv from "dotenv";
import { actionsMap } from "./actions/actions-map";
import { ActionFunction } from "./actions/action-function";
import { reactionsMap } from "./reactions/reactions-map";
import { ReactionFunction } from "./reactions/reaction-function";
import {
  handleExceptionError,
  handleValidationError,
  addLogToAreaWrapper,
} from "./log";
import { AxiosError } from "axios";

dotenv.config();

if (!process.env.RMQ_AREA_QUEUE || !process.env.RMQ_WREA_QUEUE) {
  throw new Error(
    "RMQ_AREA_QUEUE and RMQ_WREA_QUEUE must be defined as environment variable",
  );
}

export async function run(
  mongoDB: MongoDBService,
  rabbitMQ: RabbitMQService,
  isRunning: boolean,
) {
  try {
    console.log(`Connecting to MongoDB`);
    await mongoDB.connect();

    console.log(`Connecting to Rabbit MQ`);
    await rabbitMQ.connect();

    const collections = await mongoDB.listCollections();

    if (collections.length === 0) {
      await mongoDB.createCollection("users"); // Wait for collection creation
    }

    const areaQueueStress = (
      await rabbitMQ.queueStats(process.env.RMQ_AREA_QUEUE || "")
    ).messageCount;
    const webhQueueStress = (
      await rabbitMQ.queueStats(process.env.RMQ_WREA_QUEUE || "")
    ).messageCount;
    const selectedQueue =
      areaQueueStress >= webhQueueStress
        ? process.env.RMQ_AREA_QUEUE
        : process.env.RMQ_WREA_QUEUE;

    rabbitMQ
      .consumePacket(selectedQueue || "", handleArea, mongoDB)
      .then(() => {});

    process.on("SIGINT", async () => {
      isRunning = false;
    });

    process.on("SIGTERM", async () => {
      isRunning = false;
    });

    while (isRunning) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error("Something went wrong: ", error);
  } finally {
    await rabbitMQ.close();
    await mongoDB.close();
  }
}

/**
 * Update the reaction fields
 * Replace the fields in the reaction infos with the one in the area packet data
 *
 * @param areaPacket
 * @param reactionInfos
 */
export function updateReactionFields(
  areaPacket: AreaPacket,
  reactionInfos: ReactionInfos,
) {
  areaPacket.data.area_name = areaPacket.area.name;
  areaPacket.data.full_execution_date = new Date().toString();
  areaPacket.data.execution_date = new Date().toLocaleDateString();
  areaPacket.data.execution_time = new Date().toLocaleTimeString();

  Object.keys(reactionInfos).forEach((key: string) => {
    if (
      key === "type" ||
      !(key in reactionInfos) ||
      typeof reactionInfos[key as keyof ReactionInfos] !== "string" ||
      !reactionInfos[key as keyof ReactionInfos]
    ) {
      return;
    }

    reactionInfos[key as keyof ReactionInfos] = replaceField(
      reactionInfos[key as keyof ReactionInfos] as string,
      areaPacket.data,
    ) as any; // petit bypass mais je verifie le type donc c'est fine
  });
}

/**
 * Get the action and reaction functions from the area
 *
 * @param area
 *
 * @returns if not supported, return null
 * @returns if supported, return the action and reaction functions
 */
export function getAreaFunctionsByArea(area: Area): {
  actionFunction: ActionFunction;
  reactionFunction: ReactionFunction;
} | null {
  const actionType = area.action?.informations?.type;
  const reactionType = area.reaction?.informations?.type;

  if (!actionType || !reactionType) {
    console.error("Action or reaction type not found.");
    return null;
  }

  const actionFunction = actionsMap[actionType];
  if (!actionFunction) {
    console.error(`Action ${actionType} not supported.`);
    return null;
  }
  const reactionFunction = reactionsMap[reactionType];
  if (!reactionFunction) {
    console.error(`Reaction ${reactionType} not supported.`);
    return null;
  }
  return { actionFunction: actionFunction, reactionFunction: reactionFunction };
}

/**
 * Handle the area packet
 * Retrieve the action and reaction functions
 * Execute the action function
 * Update the reaction fields
 * Execute the reaction function
 * Add logs to the area
 *
 * @param areaPacket
 * @param mongoDB
 */
export async function handleArea(
  areaPacket: AreaPacket,
  mongoDB: MongoDBService,
) {
  const area = areaPacket.area;

  const functions = getAreaFunctionsByArea(area);
  if (!functions) {
    return;
  }
  const { actionFunction, reactionFunction } = functions;

  console.log(
    `Handling area: ${areaPacket.area.action.informations.type} -> ${areaPacket.area.reaction.informations.type}`,
  );

  let updatedPacket: AreaPacket | null = null;
  try {
    updatedPacket = await actionFunction(areaPacket, mongoDB);
  } catch (error: AxiosError | any) {
    await handleExceptionError(areaPacket, mongoDB, error, "action");
  }
  if (!updatedPacket) {
    return;
  }

  console.log(`Reaction: `, updatedPacket.area.reaction.informations);

  updateReactionFields(updatedPacket, updatedPacket.area.reaction.informations);

  console.log(`Updated reaction: `, updatedPacket.area.reaction.informations);

  const actionSuccess = `Action ${areaPacket.area.action.informations.type} executed successfully (id: ${updatedPacket.area._id})`;

  console.log(actionSuccess);

  await addLogToAreaWrapper(
    areaPacket,
    mongoDB,
    "action",
    actionSuccess,
    "success",
    updatedPacket.data,
  );

  try {
    await reactionFunction(updatedPacket, mongoDB);
    await addLogToAreaWrapper(
      areaPacket,
      mongoDB,
      "reaction",
      `Reaction ${areaPacket.area.reaction.informations.type} executed successfully (id: ${updatedPacket.area._id})`,
      "success",
    );
  } catch (error: ValidationError | AxiosError | any) {
    if (error instanceof ValidationError) {
      await handleValidationError(
        areaPacket,
        mongoDB,
        "reaction",
        `Reaction ${areaPacket.area.reaction.informations.type} executed unsuccessfully (id: ${updatedPacket.area._id})\nReason:\n${error.message}`,
      );
    } else {
      await handleExceptionError(areaPacket, mongoDB, error, "reaction");
    }
  }
}
