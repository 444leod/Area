import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  AuthorizationsTypes,
  CreateGoogleTaskInfos,
  getAuthorizationToken,
  MongoDBService,
  createGoogleTask,
} from "@area/shared";

export const handleCreateGoogleTaskReaction: ReactionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GOOGLE,
    database,
  );

  const reaction = packet.area.reaction.informations as CreateGoogleTaskInfos;

  const title = reaction.title;
  const body = reaction.body;

  await createGoogleTask(token, title, body);
};
