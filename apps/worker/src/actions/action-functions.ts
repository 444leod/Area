import { MongoDBService, AreaPacket } from '@area/shared';

export type ActionFunctions = (packet: AreaPacket, database: MongoDBService) => Promise<AreaPacket | null>;
