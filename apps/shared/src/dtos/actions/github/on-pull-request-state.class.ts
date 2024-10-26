import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { IsString, IsEnum, IsNotEmpty } from "class-validator";
import { RegisterAction } from "../action.decorator";

enum PullRequestStates {
  OPEN = "open",
  CLOSED = "closed",
  ALL = "all",
}

@RegisterAction(ActionTypes.ON_PULL_REQUEST_STATE)
export class OnPullRequestStateInfos extends BaseActionInfos {
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
