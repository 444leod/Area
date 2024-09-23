import { Injectable } from "@nestjs/common";
import { mongo } from "mongoose";
import { Db, MongoClient, ObjectId } from "mongodb";

@Injectable()
export class WebhookService {

  private db : any;

  constructor () {
    const base_db_uri = process.env.DB_URI || '';
    console.log('DB URI = ' + base_db_uri);
    const client = new MongoClient(base_db_uri);

    client.connect().then(() => {
      this.db = client.db('area');
    });
  }


  createArea() {
    //
  }

  async activate(payload: { headers: any; body: any; w_id: string }) {
    try {
      const webhookCollection = this.db.collection('webhooks');
      const area = await webhookCollection.findOne({ _id: new ObjectId(payload.w_id) });

      if (!area) {
        throw new Error('Area not found');
      }

      const webhookActivateCollection = this.db.collection('webhook_activation');
      const webhookActivate = {
        content: payload.body,
        headers: payload.headers,
        areaId: area._id,
        createdAt: new Date()
      };

      const result = await webhookActivateCollection.insertOne(webhookActivate);

      return {
        success: true,
        activationId: result.insertedId,
        message: 'Webhook activated successfully'
      };
    } catch (error) {
      console.error('Error activating webhook:', error);
      return {
        success: false,
        message: 'Failed to activate webhook',
        error: error.message
      };
    }
  }

}