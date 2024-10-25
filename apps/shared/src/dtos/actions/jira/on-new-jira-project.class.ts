import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { RegisterAction } from "../action.decorator";

@RegisterAction(ActionTypes.ON_NEW_JIRA_PROJECT)
export class OnNewJiraProjectClass extends BaseActionInfos {
  type: ActionTypes.ON_NEW_JIRA_PROJECT;
}
