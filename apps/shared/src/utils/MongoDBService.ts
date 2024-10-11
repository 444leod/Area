import { Db, MongoClient, ObjectId, ClientSession } from 'mongodb';
import { Area } from '../dtos';
import fs from 'fs';
import dotenv from 'dotenv';

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
      throw new Error(`${missingVariables.join(', ')} must be defined as environment variables`);
    }

    const uri: string = `mongodb://${env.MONGODB_USER}:${env.MONGODB_PASSWORD}@${env.MONGODB_HOST}:${env.MONGODB_PORT}/?authSource=${env.MONGODB_AUTH_SOURCE}&tls=true`;
    fs.readFileSync(env.MONGODB_TLS_CA_FILE as string);

    this._client = new MongoClient(uri, {
      tls: true,
      tlsCAFile: env.MONGODB_TLS_CA_FILE as string,
      tlsAllowInvalidCertificates: true,
    });

    try {
      await this._client.connect();
    } catch (error: any) {
      switch (error?.code) {
        case 'ECONNREFUSED':
          throw new Error(`Connection refused to MongoDB: ${error}`);
        case 'ECONNRESET':
          throw new Error(`Connection reset to MongoDB: ${error}`);
        default:
          break;
      }
      throw new Error(`Error in connecting to MongoDB: ${error}`);
    }
    this._db = this._client.db(env.MONGODB_DB_NAME as string);
    this._connected = true;
  }

  async close(): Promise<void> {
    if (!this._connected) return;
    await this._client.close();
    this._connected = false;
  }

  public client(): MongoClient {
    if (!this._connected) {
      throw new Error('Not connected to MongoDB');
    }
    return this._client;
  }

  public db(): Db {
    if (!this._connected) {
      throw new Error('Not connected to MongoDB');
    }
    return this._db;
  }

  async executeWithSession<T>(operation: (session: ClientSession) => Promise<T>): Promise<T> {
    if (!this._connected) {
      await this.connect();
    }
    const session: ClientSession = this._client.startSession();
    try {
      return (await session.withTransaction(async () => {
        return operation(session);
      })) as T;
    } finally {
      await session.endSession();
    }
  }

  async listCollections(): Promise<string[]> {
    return this.executeWithSession(async () => {
      const collections = await this._db.listCollections().toArray();
      return collections.map(collection => collection.name).filter(collection => !collection.startsWith('system.'));
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

  async updateAreaHistory(userId: ObjectId, area: Area): Promise<void> {
    await this.executeWithSession(async () => {
      await this._db.collection('users').updateOne({ _id: new ObjectId(userId), 'areas._id': new ObjectId(area._id) }, { $set: { 'areas.$.action.history': area.action.history } });
    });
  }

  async getAuthorizationData(userId: ObjectId, type: string): Promise<any> {
    return this.executeWithSession(async () => {
      const user = await this._db.collection('users').findOne({ _id: new ObjectId(userId) });
      const tokens = user?.authorizations;
      if (!tokens || tokens.length === 0) {
        return;
      }
      return tokens.find((token: any) => token.type === type)?.data;
    });
  }
}
