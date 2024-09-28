import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Db, MongoClient, ObjectId } from "mongodb";

export interface WebhookPayload {
  webhook_id: ObjectId;
  headers: [string, string];
  body: [string, string];
}

export interface WebhookResponse {
  success: boolean;
}

@Injectable()
export class WebhookService {
  private client: MongoClient;
  private db: Db;

  constructor() {
    const host = process.env.MONGODB_HOST || "";
    const port = parseInt(process.env.MONGODB_PORT) || 27017;
    const user = process.env.MONGODB_USER || "";
    const password = process.env.MONGODB_PASSWORD || "";
    const authSource = process.env.MONGODB_AUTH_SOURCE || "";

    const uri = `mongodb://${user}:${password}@${host}:${port}/?authSource=${authSource}`;

    this.client = new MongoClient(uri, {
      tls: true,
      tlsCAFile: process.env.MONGODB_CA_FILE || "",
      tlsAllowInvalidCertificates: true,
    });
  }


  async activate(payload: WebhookPayload): Promise<WebhookResponse> {
    const hook_collection = this.db.collection("webhooks");
    const hook = await hook_collection.findOne({ _id: payload.webhook_id });

    if (!hook) {
      throw new HttpException("Content not found", HttpStatus.NOT_FOUND);
    }

    if (
      (hook.type as string).startsWith("github") &&
      payload.headers["x-github-event"] == "ping"
    )
      return;

    const act_collection = this.db.collection("webhook_activations");
    const result = await act_collection.insertOne(payload);

    return {
      success: true,
    };
  }
}
