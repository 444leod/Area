import { ReactionFunction } from "../reaction-function";
import {
  MongoDBService,
  AreaPacket,
  CreatePullRequestCommentInfos,
  createPullRequestComment,
  getAuthorizationToken,
  AuthorizationsTypes,
} from "@area/shared";

export const handleCreatePullRequestCommentReaction: ReactionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GITHUB,
    database,
  );

  const area = packet.area;
  const reaction = area.reaction.informations as CreatePullRequestCommentInfos;

  if (isNaN(Number(reaction.pull_request_number))) {
    console.error(`Invalid pull request number: ${reaction.pull_request_number}`);
    return false;
  }

  await createPullRequestComment(
    token,
    reaction.owner,
    reaction.repository,
    Number(reaction.pull_request_number),
    reaction.body,
  );
  return true;
};
