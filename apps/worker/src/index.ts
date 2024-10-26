import {
  AreaPacket,
  RabbitMQService,
  MongoDBService,
  replaceField,
  ReactionInfos,
  LogType,
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
    await mongoDB.connect();
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

  let res: AreaPacket | null = null;
  try {
    res = await actionFunction(areaPacket, mongoDB);
  } catch (error: AxiosError | any) {
    await handleError(error, "action");
  }
  if (!res) return;

  res.data.area_name = res.area.name;
  res.data.full_execution_date = new Date().toString();
  res.data.execution_date = new Date().toLocaleDateString();
  res.data.execution_time = new Date().toLocaleTimeString();

  console.log(`Reaction: `, res.area.reaction.informations);

  Object.keys(res.area.reaction.informations).forEach((key: string) => {
    const infos = res.area.reaction.informations;

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
      res.data
    ) as any; // petit bypass mais je verifie le type donc c'est fine
  });

  console.log(`Updated reaction: `, res.area.reaction.informations);

  console.log(
    `Action ${areaPacket.area.action.informations.type} executed successfully (id: ${res.area._id})`
  );
  try {
    await reactionFunction(res, mongoDB);
  } catch (error: AxiosError | any) {
    await handleError(error, "reaction");
  }
}

async function handleError(error: AxiosError | any, type: LogType) {
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
  //log the message on MongoDB
}
