import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { IsString, IsEnum, IsNotEmpty } from "class-validator";

enum PullRequestStates {
  OPEN = "open",
  CLOSED = "closed",
  ALL = "all",
}

export class OnPullRequestStateClass extends BaseActionInfos {
  type: ActionTypes.ON_PULL_REQUEST_STATE;

  @IsEnum(PullRequestStates)
  state: PullRequestStates;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  repository: string;
}
