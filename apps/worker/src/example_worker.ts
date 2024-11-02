import { AreaPacket, RabbitMQService, MongoDBService } from "@area/shared";
import dotenv from "dotenv";
dotenv.config();

const connection = new RabbitMQService();
const database = new MongoDBService();

//Do mongodb connection here to not repeat the connection every time handleArea is called

async function handleArea(area: AreaPacket) {
  // Put worker logic here
  console.log(area);
}

connection.connect().then(() => {
  connection.consumePacket("QUEUE_NAME", handleArea, database).then(() => {});
});
