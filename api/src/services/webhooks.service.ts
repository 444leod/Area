import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Db, MongoClient, ObjectId } from 'mongodb';

export interface WebhookPayload {
  id: ObjectId;
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
    console.log('DB URI = ' + base_db_uri);
    const client = new MongoClient(base_db_uri);

    client.connect().then(() => {
      this.db = client.db('area');
    });
  }

  async activate(payload: WebhookPayload): Promise<WebhookResponse> {
    const hook_collection = this.db.collection('webhooks');
    const area = await hook_collection.findOne({ _id: payload.id });

    if (!area) {
      throw new HttpException('AREA not found', HttpStatus.NOT_FOUND);
    }

    const act_collection = this.db.collection('webhook_activation');

    const result = await act_collection.insertOne(payload);

    return {
      success: true,
    };
  }
}
