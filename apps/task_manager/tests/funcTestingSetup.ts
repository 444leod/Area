import { ObjectId } from "mongodb";
import {
  MongoDBService,
  User,
  ReactionTypes,
  ActionTypes,
} from "@area/shared";

const user01: User = {
  first_name: "user01",
  last_name: "user01",
  email: "user01@test.com",
  password: "user01",
  _id: new ObjectId("deadbeefdeadbeefdeadbee0"),
  areas: [
    {
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
    {
      _id: new ObjectId("deadbeefdeadbeefdeadbee4"),
      name: "active_is_webhook",
      action: {
        is_webhook: true,
        service_id: new ObjectId("deadbeefdeadbeefdeadbee5"),
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
        service_id: new ObjectId("deadbeefdeadbeefdeadbee6"),
        informations: {
          type: ReactionTypes.EXAMPLE_REACTION,
          exampleField: "exampleValue",
        },
      },
      active: true,
      logs: [],
    },
  ],
  authorizations: [],
};

const user02: User = {
  first_name: "user02",
  last_name: "user02",
  email: "user02@test.com",
  password: "user02",
  _id: new ObjectId("deadbeefdeadbeefdeadbee7"),
  areas: [
    {
      _id: new ObjectId("deadbeefdeadbeefdeadbee8"),
      name: "inactive_not_webhook",
      action: {
        is_webhook: false,
        service_id: new ObjectId("deadbeefdeadbeefdeadbee9"),
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
        service_id: new ObjectId("deadbeefdeadbeefdeadbeea"),
        informations: {
          type: ReactionTypes.EXAMPLE_REACTION,
          exampleField: "exampleValue",
        },
      },
      active: false,
      logs: [],
    },
    {
      _id: new ObjectId("deadbeefdeadbeefdeadbeeb"),
      name: "inactive_is_webhook",
      action: {
        is_webhook: true,
        service_id: new ObjectId("deadbeefdeadbeefdeadbeec"),
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
        service_id: new ObjectId("deadbeefdeadbeefdeadbeed"),
        informations: {
          type: ReactionTypes.EXAMPLE_REACTION,
          exampleField: "exampleValue",
        },
      },
      active: false,
      logs: [],
    },
  ],
  authorizations: [],
};

const mongoDB = new MongoDBService();

async function main() {
  await mongoDB.connect();
  
  try {
    // Clear the collection and insert the test users
    mongoDB.deleteCollection("users");
    mongoDB.createCollection("users");
    await mongoDB.executeWithSession(async () => {
      await mongoDB
        .db()
        .collection<User>("users")
        .insertMany([user01, user02]);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoDB.close();
  }
}


main().catch(console.error);