import { MongoDBService, AreaPacket } from '@area/shared';

export type ActionFunction = (packet: AreaPacket, database: MongoDBService) => Promise<AreaPacket | null>;
