import { Db, MongoClient } from "mongodb";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const env = {
  MONGODB_TLS_CA_FILE: process.env.MONGODB_TLS_CA_FILE,
  MONGODB_HOST: process.env.MONGODB_HOST,
  MONGODB_PORT: process.env.MONGODB_PORT,
  MONGODB_USER: process.env.MONGODB_USER,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  MONGODB_AUTH_SOURCE: process.env.MONGODB_AUTH_SOURCE,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
};

export class MongoDBService {
  private _client!: MongoClient;
  private _db!: Db;
  private _connected: Boolean = false;

  async connect(): Promise<void> {
    if (this._connected) return;

    const missingVariables = Object.entries(env)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    if (missingVariables.length > 0) {
      throw new Error(
        `${missingVariables.join(", ")} must be defined as environment variables`
      );
    }
    console.log(env.MONGODB_TLS_CA_FILE)

    const uri: string = `mongodb://${env.MONGODB_USER}:${env.MONGODB_PASSWORD}@${env.MONGODB_HOST}:${env.MONGODB_PORT}/?authSource=${env.MONGODB_AUTH_SOURCE}&tls=true`;
    fs.readFileSync(env.MONGODB_TLS_CA_FILE as string);

    this._client = new MongoClient(uri, {
      tls: true,
      tlsCAFile: env.MONGODB_TLS_CA_FILE as string,
      tlsAllowInvalidCertificates: true,
    });

    await this._client.connect();
    this._db = this._client.db(env.MONGODB_DB_NAME as string);
    this._connected = true;
  }

  async close(): Promise<void> {
    if (!this._connected) return;
    await this._client.close();
    this._connected = false;
  }

  public client(): MongoClient | undefined {
    return this._connected ? this._client : undefined;
  }

  public db(): Db | undefined {
    return this._connected ? this._db : undefined;
  }

  async executeWithSession<T>(
    operation: (session: any) => Promise<T>
  ): Promise<T> {
    if (!this._connected) {
      await this.connect();
    }
    const session = this._client.startSession();
    try {
      return await session.withTransaction(async () => {
        return operation(session);
      });
    } finally {
      await session.endSession();
    }
  }

  async listCollections(): Promise<string[]> {
    return this.executeWithSession(async () => {
      const collections = await this._db.listCollections().toArray();
      return collections
        .map((collection) => collection.name)
        .filter((collection) => !collection.startsWith("system."));
    });
  }

  async createCollection(collectionName: string): Promise<void> {
    await this.executeWithSession(async () => {
      await this._db.createCollection(collectionName);
    });
  }

  async deleteCollection(collectionName: string): Promise<void> {
    await this.executeWithSession(async () => {
      await this._db.collection(collectionName).drop();
    });
  }

  async getActiveArea(): Promise<any> {
    return this.executeWithSession(async () => {
      return await this._db
        .collection("areas")
        .findOne({ active: true });
    });
  }
}

// import dotenv from "dotenv";
import {
  AreaDTO,
  ActionTypes,
  ReactionTypes,
  RabbitMQService,
} from "@area/shared";
import { ObjectId } from "mongodb";

dotenv.config();

const rabbitMQ = new RabbitMQService();
const mongoDB = new MongoDBService();

//THIS IS STILL WIP, WILL BE DONE ON PR 42 (2/2)
//Console log will remain in the mean time
async function main() {
  const groupAreaSend = (areas: AreaDTO[]) => {
    areas.forEach((area) => {
      rabbitMQ.sendAreaToQueue(area);
    });
  };

  const queueIsEmpty = async () => {
    return (await rabbitMQ.queueStats()).messageCount == 0;
  };

  await rabbitMQ.connect();
  await mongoDB.connect();

  try {
    await mongoDB.listCollections().then((collections) => {
      console.log("Collections: ", collections)});
  } catch (err) {
    console.error(err);
  } finally {
    await mongoDB.close();
  }

  // mock data
  const example_area: AreaDTO = {
    _id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
    action: {
      _id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      service_id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      informations: {
        type: ActionTypes.EXAMPLE_ACTION,
        exampleField: "example",
      },
      history: {
        type: ActionTypes.EXAMPLE_ACTION,
        exampleHistory: [],
      },
      isWebhook: false,
    },
    reaction: {
      _id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      service_id: ObjectId.createFromHexString("deadbeefdeadbeefdeadbeef"),
      informations: {
        type: ReactionTypes.EXAMPLE_REACTION,
        exampleField: "example",
      },
    },
    active: true,
  };

  setInterval(async () => {
    if (await queueIsEmpty()) {
      console.log("Sending areas to queue");
      groupAreaSend([
        example_area,
        example_area,
        example_area,
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
