import { Injectable } from "@nestjs/common";
import { Db, MongoClient } from "mongodb";
import { SendEmailDTO } from '@shared/dto/send_mail.dto'

@Injectable()
export class AreasService {

  private db : Db;

  constructor () {
    const base_db_uri = process.env.DB_URI || '';
    console.log('DB URI = ' + base_db_uri);
    const client = new MongoClient(base_db_uri);

    client.connect().then(() => {
      this.db = client.db('area');
    });
  }

  createArea(dto: SendEmailDTO) {
    const areas = this.db.collection('areas');
    const actions = this.db.collection('actions');
    const reactions = this.db.collection('reactons');
    const webhooks = this.db.collection('webhooks');

    (async () => {
      const actionResult = await actions.insertOne({});
      const reactionResult = await reactions.insertOne(dto);

      console.log(actionResult);
      console.log(reactionResult);

      const areaResult = await areas.insertOne({
        action_id: actionResult.insertedId,
        reaction_id: reactionResult.insertedId
      });
      const hookResult = await webhooks.insertOne({
        action_id: actionResult.insertedId,
        reaction_id: reactionResult.insertedId,
        area_id: areaResult.insertedId
      });
    })();

  }

}