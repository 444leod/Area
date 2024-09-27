import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Db, MongoClient, ObjectId } from 'mongodb';

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
  private db: Db;

  constructor() {
    const base_db_uri = process.env.DB_URI || '';
    const client = new MongoClient(base_db_uri);

    client.connect().then(() => {
      this.db = client.db('area');
    }).catch(() => {
      console.error("Connection to DB failed.");
    });
  }

  async activate(payload: WebhookPayload): Promise<WebhookResponse> {
    const hook_collection = this.db.collection('webhooks');
    const hook = await hook_collection.findOne({ _id: payload.webhook_id });

    if (!hook) {
      throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    }

    if ((hook.type as string).startsWith('github') && payload.headers['x-github-event'] == 'ping')
      return;

    const act_collection = this.db.collection('webhook_activations');
    const result = await act_collection.insertOne(payload);

    return {
      success: true,
    };
  }
}
