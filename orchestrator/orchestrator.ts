import { ActionTypes } from "@shared/dtos/actions/action_types.dto";
import { ReactionTypes } from "@shared/dtos/reactions/reaction_types.dto";
import { RabbitMQConnection } from "@shared/utils/RabbitMQConnection";
import { ObjectId } from "mongodb";

const connection = new RabbitMQConnection();

connection.connect().then(() => {
  connection.sendAreaToQueue({
    _id: ObjectId.createFromHexString("deadbeef"),
    action: {
      _id: ObjectId.createFromHexString("deadbeef"),
      service_id: ObjectId.createFromHexString("deadbeef"),
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
      _id: ObjectId.createFromHexString("deadbeef"),
      service_id: ObjectId.createFromHexString("deadbeef"),
      informations: {
        type: ReactionTypes.EXEMPLE_REACTION,
        exempleField: "exemple",
      },
    },
    active: true,
  });
  connection.consumeArea(
    (area) => {
      console.log(area);
    }
  )
});
