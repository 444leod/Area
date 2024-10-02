import { MongoDBService, AreaPacket } from '@area/shared';

export type ReactionFunctions = (packet: AreaPacket, database: MongoDBService) => Promise<void>;
