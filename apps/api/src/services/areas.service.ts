import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Db, MongoClient, ObjectId } from "mongodb";
import { SendEmailDTO } from "@area/shared";
import * as fs from "fs";

@Injectable()
export class AreasService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  constructor() {
    const host = process.env.MONGO_HOST || "";
    const port = parseInt(process.env.MONGO_PORT) || 27017;
    const user = process.env.MONGO_USER || "";
    const password = process.env.MONGO_PASSWORD || "";
    const authSource = process.env.MONGO_AUTH_SOURCE || "";

    const uri = `mongodb://${user}:${password}@${host}:${port}/?authSource=${authSource}`;

    this.client = new MongoClient(uri, {
      tls: true,
      tlsCAFile: process.env.MONGO_CA_FILE || "",
      tlsAllowInvalidCertificates: true,
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.db = this.client.db("area");
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.close();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error while disconnecting from MongoDB:", error);
    }
  }

  async createArea(dto: SendEmailDTO): Promise<ObjectId> {
    const areas = this.db.collection("areas");
    const reactions = this.db.collection("reactions");
    const webhooks = this.db.collection("webhooks");

    const session = this.client.startSession();
    try {
      const result = await session.withTransaction(async () => {
        const hookResult = await webhooks.insertOne(
          {
            type: "githubPullRequest",
          },
          { session },
        );

        const reactionResult = await reactions.insertOne(
          {
            type: "sendEmail",
            data: dto,
          },
          { session },
        );

        await areas.insertOne(
          {
            webhook_id: hookResult.insertedId,
            reaction_id: reactionResult.insertedId,
          },
          { session },
        );

        return hookResult.insertedId;
      });

      return result;
    } finally {
      await session.endSession();
    }
  }
}
