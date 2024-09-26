import { ActionTypes } from "@shared/dtos/actions/action_types.dto";
import { ReactionTypes } from "@shared/dtos/reactions/reaction_types.dto";
import { RabbitMQConnection } from "@shared/utils/RabbitMQConnection";
import { ObjectId } from "mongodb";

const connection = new RabbitMQConnection();

async function main() {
  await connection.connect();
  console.log("sending area to queue");
  connection.sendAreaToQueue({
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
  });
  console.log("Area sent to queue");
}

main().catch((err) => {
  console.error(err);
});
