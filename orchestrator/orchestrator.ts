import { AreaDTO } from "@shared/dtos/area.dto";
import { ActionTypes } from "@shared/dtos/actions/action_types.dto";
import { ReactionTypes } from "@shared/dtos/reactions/reaction_types.dto";
import { RabbitMQService } from "@shared/utils/RabbitMQService";
import { ObjectId } from "mongodb";

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
  const exemple_area: AreaDTO = {
    _id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
    action: {
      _id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      service_id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      informations: {
        type: ActionTypes.EXEMPLE_ACTION,
        exempleField: "exemple",
      },
      history: {
        type: ActionTypes.EXEMPLE_ACTION,
        exempleHistory: [],
      },
      isWebhook: false,
    },
    reaction: {
      _id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      service_id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      informations: {
        type: ReactionTypes.EXEMPLE_REACTION,
        exempleField: "exemple",
      },
    },
    active: true,
  };

  setInterval(async () => {
    if (await queueIsEmpty()) {
      console.log("Sending areas to queue");
      groupAreaSend([
        exemple_area,
        exemple_area,
        exemple_area,
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
