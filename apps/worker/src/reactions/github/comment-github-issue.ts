import { ReactionFunction } from "../reaction-function";
import {
  MongoDBService,
  AreaPacket,
  CommentGithubIssueInfos,
  commentGithubIssue,
  getAuthorizationToken,
  AuthorizationsTypes,
  ValidationError,
} from "@area/shared";

export const handleCommentGithubIssueReaction: ReactionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GITHUB,
    database,
  );

  const area = packet.area;
  const reaction = area.reaction.informations as CommentGithubIssueInfos;

  if (isNaN(Number(reaction.issue_number))) {
    throw new ValidationError(`Invalid issue number: ${reaction.issue_number}`);
  }

  await commentGithubIssue(
    token,
    reaction.owner,
    reaction.repository,
    Number(reaction.issue_number),
    reaction.body,
  );
  return;
};
