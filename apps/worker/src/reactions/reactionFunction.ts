import { MongoDBService, AreaDTO } from '@area/shared';

export type ReactionFunction = (area: AreaDTO, database: MongoDBService) => Promise<void>;
