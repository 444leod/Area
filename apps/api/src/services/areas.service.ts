import { Injectable } from '@nestjs/common';
import { Db, InsertOneResult, MongoClient, ObjectId } from 'mongodb';
import { SendEmailDTO } from '@area/shared';

@Injectable()
export class AreasService {
  private db: Db;

  constructor() {
    const base_db_uri = process.env.DB_URI || '';
    console.log('DB URI = ' + base_db_uri);
    const client = new MongoClient(base_db_uri);

    client.connect().then(() => {
      this.db = client.db('area');
    });
  }

  async createArea(dto: SendEmailDTO): Promise<ObjectId> {
    const areas = this.db.collection('areas');
    const reactions = this.db.collection('reactions');
    const webhooks = this.db.collection('webhooks');

    const hookResult = await webhooks.insertOne({
      type: 'githubPullRequest',
    });

    const reactionResult = await reactions.insertOne({
      type: 'sendEmail',
      data: dto,
    });

    const areaResult = await areas.insertOne({
      webhook_id: hookResult.insertedId,
      reaction_id: reactionResult.insertedId,
    });

    return hookResult.insertedId;
  }
}
