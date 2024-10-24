import { ReactionFunction } from "../reaction-function";
import {
  MongoDBService,
  AreaPacket,
  CreatePullRequestCommentClass,
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
  const reaction = area.reaction.informations as CreatePullRequestCommentClass;

  if (isNaN(Number(reaction.pull_request_number))) {
    console.error("pull request number is not a number.");
    return;
  }

  await createPullRequestComment(
    token,
    reaction.owner,
    reaction.repository,
    Number(reaction.pull_request_number),
    reaction.body,
  );
  return;
};
