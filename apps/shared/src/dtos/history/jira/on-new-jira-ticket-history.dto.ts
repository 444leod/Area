import { ActionTypes } from "../../actions";

export interface OnNewJiraTicketHistoryDTO {
  type: ActionTypes.ON_NEW_JIRA_TICKET;
  lastCreationTimestamp: number;
}
