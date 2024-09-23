import {reactionsMap} from "./reactions/reactionsMap";

const { MongoClient, Db } = require('mongodb');
require('dotenv').config();

async function run(database: typeof Db) {
    try {
      const reactionsCollection = database.collection("reactions");

      const reactions = await reactionsCollection.find({}).toArray();

      for (const reaction of reactions) {
        const func = reactionsMap[reaction.type || ""];
        if (func) {
          await func(reaction);
        } else {
          console.error(`type ${reaction.type} not found`);
        }
      }
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
    const database = client.db('local');

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
