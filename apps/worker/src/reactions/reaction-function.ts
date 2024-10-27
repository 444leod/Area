import { MongoDBService, AreaPacket } from "@area/shared";

export type ReactionFunction = (
  packet: AreaPacket,
  database: MongoDBService,
) => Promise<boolean>;
