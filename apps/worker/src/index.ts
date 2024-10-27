import {
  AreaPacket,
  RabbitMQService,
  MongoDBService,
  replaceField,
  ReactionInfos,
  LogType,
  LogStatus,
  ValidationError,
} from "@area/shared";
import dotenv from "dotenv";
import { actionsMap } from "./actions/actions-map";
import { reactionsMap } from "./reactions/reactions-map";
import { AxiosError, isAxiosError } from "axios";

dotenv.config();

if (!process.env.RMQ_AREA_QUEUE || !process.env.RMQ_WREA_QUEUE) {
  throw new Error(
    "RMQ_AREA_QUEUE and RMQ_WREA_QUEUE must be defined as environment variable"
  );
}

const rabbitMQ = new RabbitMQService();
const mongoDB = new MongoDBService();

let isRunning = true;

async function run() {
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

    rabbitMQ.consumePacket(selectedQueue || "", handleArea).then(() => {});

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

run().catch(console.dir);

async function handleArea(areaPacket: AreaPacket) {
  const addLogToAreaWrapper = async (
    type: LogType,
    errorMessage: string,
    status: LogStatus,
    replacedVariables?: { [key: string]: any }
  ) => {
    await mongoDB.addLogToArea(areaPacket.user_id, areaPacket.area._id, {
      type: type,
      date: new Date().toISOString(),
      status: status,
      message: errorMessage,
      replacedVariables: replacedVariables,
    });
  };

  const handleExceptionError = async (
    error: AxiosError | any,
    type: LogType
  ) => {
    const errorMessage = JSON.stringify(
      isAxiosError(error)
        ? error.response
          ? {
              message: error.message,
              url: error.config?.url,
              status: error.response.status,
              statusText: error.response.statusText,
            }
          : {
              message: error.message,
              description: "Request was made but no response received.",
            }
        : { message: error.message }
    );
    console.error(errorMessage);
    await addLogToAreaWrapper(type, errorMessage, "exception_error");
  };

  const handleValidationError = async (type: LogType, errorMessage: string) => {
    console.error(errorMessage);
    await addLogToAreaWrapper(type, errorMessage, "validation_error");
  };

  const actionType = areaPacket?.area.action?.informations?.type;
  const reactionType = areaPacket?.area.reaction?.informations?.type;

  if (!actionType || !reactionType) {
    console.error("Action or reaction type not found.");
    return;
  }

  const actionFunction = actionsMap[actionType];
  if (!actionFunction) {
    console.error(`Action ${actionType} not supported.`);
    return;
  }
  const reactionFunction = reactionsMap[reactionType];
  if (!reactionFunction) {
    console.error(`Reaction ${reactionType} not supported.`);
    return;
  }

  console.log(
    `Handling area: ${areaPacket.area.action.informations.type} -> ${areaPacket.area.reaction.informations.type}`
  );

  let updatedPacket: AreaPacket | null = null;
  try {
    updatedPacket = await actionFunction(areaPacket, mongoDB);
  } catch (error: AxiosError | any) {
    await handleExceptionError(error, "action");
  }
  if (!updatedPacket) {
    return;
  }

  updatedPacket.data.area_name = updatedPacket.area.name;
  updatedPacket.data.full_execution_date = new Date().toString();
  updatedPacket.data.execution_date = new Date().toLocaleDateString();
  updatedPacket.data.execution_time = new Date().toLocaleTimeString();

  console.log(`Reaction: `, updatedPacket.area.reaction.informations);

  Object.keys(updatedPacket.area.reaction.informations).forEach(
    (key: string) => {
      const infos = updatedPacket.area.reaction.informations;

      if (
        key === "type" ||
        !(key in infos) ||
        typeof infos[key as keyof ReactionInfos] !== "string" ||
        !infos[key as keyof ReactionInfos]
      ) {
        return;
      }

      infos[key as keyof ReactionInfos] = replaceField(
        infos[key as keyof ReactionInfos] as string,
        updatedPacket.data
      ) as any; // petit bypass mais je verifie le type donc c'est fine
    }
  );

  console.log(`Updated reaction: `, updatedPacket.area.reaction.informations);

  const actionSuccess = `Action ${areaPacket.area.action.informations.type} executed successfully (id: ${updatedPacket.area._id})`;

  console.log(actionSuccess);

  addLogToAreaWrapper("action", actionSuccess, "success", updatedPacket.data);

  try {
    await reactionFunction(updatedPacket, mongoDB);
    await addLogToAreaWrapper(
      "reaction",
      `Reaction ${areaPacket.area.reaction.informations.type} executed successfully (id: ${updatedPacket.area._id})`,
      "success"
    );
  } catch (error: ValidationError | AxiosError | any) {
    if (error instanceof ValidationError) {
      await handleValidationError(
        "reaction",
        `Reaction ${areaPacket.area.reaction.informations.type} executed unsuccessfully (id: ${updatedPacket.area._id})\nReason:\n${error.message}`
      );
    } else {
      await handleExceptionError(error, "reaction");
    }
  }
}
