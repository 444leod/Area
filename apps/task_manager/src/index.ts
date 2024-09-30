import dotenv from "dotenv";
import {
  AreaDTO,
  ActionTypes,
  ReactionTypes,
  RabbitMQService,
  MongoDBService,
} from "@area/shared";
import { ObjectId } from "mongodb";

dotenv.config();

const rabbitMQ = new RabbitMQService();
const mongoDB = new MongoDBService();

//THIS IS STILL WIP, WILL BE DONE ON PR 42 (2/2)
//Console log will remain in the mean time
async function main() {
  const groupAreaSend = (areas: AreaDTO[]) => {
    areas.forEach((area) => {
      rabbitMQ.sendAreaToQueue(area);
    });
  };

  const queueIsEmpty = async () => {
    return (await rabbitMQ.queueStats()).messageCount == 0;
  };

  await rabbitMQ.connect();
  await mongoDB.connect();

  try {
    await mongoDB.listCollections().then((collections) => {
      console.log("Collections: ", collections)});
  } catch (err) {
    console.error(err);
  } finally {
    await mongoDB.close();
  }

  // mock data
  const example_area: AreaDTO = {
    _id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
    action: {
      _id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      service_id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      informations: {
        type: ActionTypes.EXAMPLE_ACTION,
        exampleField: "example",
      },
      history: {
        type: ActionTypes.EXAMPLE_ACTION,
        exampleHistory: [],
      },
      isWebhook: false,
    },
    reaction: {
      _id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      service_id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      informations: {
        type: ReactionTypes.EXAMPLE_REACTION,
        exampleField: "example",
      },
    },
    active: true,
  };

  setInterval(async () => {
    if (await queueIsEmpty()) {
      console.log("Sending areas to queue");
      groupAreaSend([
        example_area,
        example_area,
        example_area,
        // get data from Mongo
      ]);
      console.log("Areas sent to queue");
    } else {
      console.log("Not sending, queue is not empty");
    }
  }, 100); // 1/10th of a sec between checks
}

main().catch((err) => {
  console.error(err);
});
