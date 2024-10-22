import { MongoDBService, AreaPacket, WebhookreaPacket } from '@area/shared';

export type ReactionFunction = (packet: AreaPacket, database: MongoDBService) => Promise<void>;
