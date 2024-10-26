import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { RegisterAction } from "../action.decorator";

@RegisterAction(ActionTypes.ON_NEW_GITHUB_REPOSITORY)
export class OnNewGithubRepositoryInfos extends BaseActionInfos {
  type: ActionTypes.ON_NEW_GITHUB_REPOSITORY;
}
