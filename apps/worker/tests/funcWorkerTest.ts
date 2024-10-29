import {
  AreaPacket,
  RabbitMQService,
  ActionTypes,
  ReactionTypes,
} from "@area/shared";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import assert from "assert";
dotenv.config();

const rabbitMQ = new RabbitMQService();

let count = 0;
const maxCount = 5;

const mockArea: AreaPacket = {
  user_id: new ObjectId("deadbeefdeadbeefdeadbee0"),
  area: {
    _id: new ObjectId("deadbeefdeadbeefdeadbee1"),
    name: "active_not_webhook",
    action: {
      is_webhook: false,
      service_id: new ObjectId("deadbeefdeadbeefdeadbee2"),
      informations: {
        type: ActionTypes.EXAMPLE_ACTION,
        exampleField: "exampleValue",
      },
      history: {
        type: ActionTypes.EXAMPLE_ACTION,
        exampleHistory: ["exampleValue"],
      },
    },
    reaction: {
      service_id: new ObjectId("deadbeefdeadbeefdeadbee3"),
      informations: {
        type: ReactionTypes.EXAMPLE_REACTION,
        exampleField: "exampleValue",
      },
    },
    active: true,
    logs: [],
  },
  data: { area_name: "active_not_webhook" },
  authorizations: [],
};

async function handleArea(area: AreaPacket) {
  if (count === maxCount - 1) return true;

  assert(JSON.stringify(area) === JSON.stringify(mockArea));
  console.log(`area ${count} received in a proper way`);
  count++;
  return false;
}

rabbitMQ
  .connect()
  .then(async () => {
    let shouldStop = false;
    await rabbitMQ.consumePacket(process.env.RMQ_QUEUE || "", async (area) => {
      shouldStop = await handleArea(area);
      if (shouldStop) {
        await rabbitMQ.close();
        console.log(
          `Stopped consuming messages after handling the ${maxCount} number of areas.`
        );
      }
    });
  })
  .catch((error) => {
    console.error("Something went wrong: ", error);
  });
