import { MongoDBService, Area } from '@area/shared';

export type ActionFunction = (area: Area, database: MongoDBService) => Promise<Area> | undefined;
