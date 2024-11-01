import { IsNotEmpty, IsString } from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ReactionTypes } from "../reaction-types.enum";
import { RegisterReaction } from "../reaction.decorator";
import { IsNumberOrVariable } from "../../../validators";
import { ApiProperty } from "@nestjs/swagger";

@RegisterReaction(ReactionTypes.COMMENT_GITHUB_ISSUE)
export class CommentGithubIssueInfos extends BaseReactionInfos {
  type: ReactionTypes.COMMENT_GITHUB_ISSUE;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  repository: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberOrVariable(0)
  issue_number: number | string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
