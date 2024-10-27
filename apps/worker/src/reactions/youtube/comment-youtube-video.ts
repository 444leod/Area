import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  AuthorizationsTypes,
  getAuthorizationToken,
  MongoDBService,
  CommentYoutubeVideoInfos,
  commentYoutubeVideo,
} from "@area/shared";

export const handleCommentYoutubeVideoReaction: ReactionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GOOGLE,
    database,
  );

  const reaction = packet.area.reaction
    .informations as CommentYoutubeVideoInfos;

  const content = reaction.content;

  await commentYoutubeVideo(token, reaction.video_id, content);
  return true;
};
