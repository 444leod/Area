import { MongoDBService, Area } from '@area/shared';

export type ReactionFunction = (area: Area, database: MongoDBService) => Promise<void>;
