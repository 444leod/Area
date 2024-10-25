import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_NEW_JIRA_PROJECT)
export class OnNewJiraProjectHistoryDTO {
  type: ActionTypes.ON_NEW_JIRA_PROJECT;
  projectList: string[] = [];
}
