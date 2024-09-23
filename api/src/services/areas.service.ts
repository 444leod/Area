import { Injectable } from "@nestjs/common";
import { mongo } from "mongoose";
import { Db, MongoClient } from "mongodb";

@Injectable()
export class AreasService {

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

  async example() {
    const collection = this.db.collection('user');
    await collection.insertOne({
      name: 'Elliot',
      age: 20
    });
    const result = collection.find().toArray();
    console.log(result);
    return result;
  }

}