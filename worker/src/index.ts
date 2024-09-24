import {reactionsMap} from "./reactions/reactionsMap";
import { triggerWebhook } from "./webhooks/triggerWebhook";
import { MongoClient, Db, ObjectId } from 'mongodb';
require('dotenv').config();

async function getAreaByWebhookId(database: Db, webhookId: string) {
  const result = await database.collection("areas").aggregate([
    { $match: { webhook_id: webhookId } },
    {
        $lookup: {
            from: "reactions",
            localField: "reaction_id",
            foreignField: "_id",
            as: "reaction"
        }
    },
    {
        $lookup: {
            from: "webhooks",
            localField: "webhook_id",
            foreignField: "_id",
            as: "webhook"
        }
    }
  ]).toArray();

  return result[0];
}

async function getAreaByActionId(database: Db, actionId: string) {
  const result = await database.collection("areas").aggregate([
      { $match: { action_id: actionId } },
      {
          $lookup: {
              from: "reactions",
              localField: "reaction_id",
              foreignField: "_id",
              as: "reaction"
          }
      },
      {
          $lookup: {
              from: "actions",
              localField: "action_id",
              foreignField: "_id",
              as: "action"
          }
      }
  ]).toArray();

  return result[0];
}

async function run(database: Db) {
    try {
      // const actionsCollection = database.collection("actions");

      // const actions = await actionsCollection.find({}).toArray();

      // for (const reaction of actions) {
      //   const area = await getAreaByActionId(database, reaction.action_id);
      //   if (area) {
      //     await triggerAction(area, reaction);
      // }

      const webhooksCollection = database.collection("webhook_activations");

      const webhooks = await webhooksCollection.find({}).toArray();

      for (const webhook of webhooks) {
        const area = await getAreaByWebhookId(database, webhook.webhook_id);
        if (area) {
          await triggerWebhook(area, webhook);
        }
      }
      webhooksCollection.deleteMany({});
    } catch (err) {
      console.error('Error in run function:', err);
    }
}

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI must be defined in .env');
  }

  const client = new MongoClient(uri);

  try {
    // Connexion à MongoDB
    await client.connect();
    const database = client.db('area');

    await run(database);
    setInterval(
        async () => {
          try {
            await run(database);
          } catch (err) {
            console.error('Error in interval run:', err);
          }
        },
        60000 // 1 minute
    );
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);
