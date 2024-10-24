import { ActionTypes } from "../../actions";

export interface OnNewJiraProjectHistoryDTO {
  type: ActionTypes.ON_NEW_JIRA_PROJECT;
  projectList: string[];
}
