import { IsNotEmpty, IsString } from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ReactionTypes } from "../reaction-types.enum";

export class CreatePullRequestCommentClass extends BaseReactionInfos {
  type: ReactionTypes.CREATE_PULL_REQUEST_COMMENT;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  repository: string;

  @IsString()
  @IsNotEmpty()
  pull_request_number: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
