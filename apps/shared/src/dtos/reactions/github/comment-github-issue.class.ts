import { IsNotEmpty, IsString } from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ReactionTypes } from "../reaction-types.enum";
import { RegisterReaction } from "../reaction.decorator";

@RegisterReaction(ReactionTypes.COMMENT_GITHUB_ISSUE)
export class CommentGithubIssueInfos extends BaseReactionInfos {
  type: ReactionTypes.COMMENT_GITHUB_ISSUE;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  repository: string;

  @IsString()
  @IsNotEmpty()
  issue_number: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
