import { run } from "./index";
import { MongoDBService, RabbitMQService } from "@area/shared";

const rabbitMQ = new RabbitMQService();
const mongoDB = new MongoDBService();

const isRunning = true;

run(mongoDB, rabbitMQ, isRunning).catch(console.dir);
