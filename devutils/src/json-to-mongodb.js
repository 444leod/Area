import { MongoDBService } from "@area/shared";
import dotenv from "dotenv";
import fs from "fs";
import { ObjectId } from "mongodb";

dotenv.config();

const mongoDB = new MongoDBService();

if (!process.argv[2]) {
  console.error("Usage: npm run json-to-mongodb <filepath>");
  process.exit(1);
}

const filepath = process.argv[2];
const content = fs.readFileSync(filepath, "utf-8");

const data = JSON.parse(content);

console.log("Replacing keys");

function replaceKeys(obj) {
  Object.keys(obj).forEach((key) => {
    if (key === "_id") {
      obj[key] = new ObjectId();
    } else if (typeof obj[key] === "object") {
      replaceKeys(obj[key]);
    }
  });
}

replaceKeys(data);

console.log("Connecting to MongoDB");

await mongoDB.connect();

console.log("Inserting data");

await mongoDB.db().collection(process.env.MONGODB_COLLECTION).insertMany(data);

console.log("Data inserted");

await mongoDB.close();

console.log("Connection closed");

process.exit(0);
