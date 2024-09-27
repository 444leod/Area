import dotenv from "dotenv";
import {
  AreaDTO,
  ActionTypes,
  ReactionTypes,
  RabbitMQService,
} from "@area/shared";
import { ObjectId } from "mongodb";

dotenv.config();

const rmqConnection = new RabbitMQService();

//THIS IS STILL WIP, WILL BE DONE ON PR 42 (2/2)
//Console log will remain in the mean time
async function main() {
  const groupAreaSend = (areas: AreaDTO[]) => {
    areas.forEach((area) => {
      rmqConnection.sendAreaToQueue(area);
    });
  };

  const queueIsEmpty = async () => {
    return (await rmqConnection.queueStats()).messageCount == 0;
  };

  await rmqConnection.connect();

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
