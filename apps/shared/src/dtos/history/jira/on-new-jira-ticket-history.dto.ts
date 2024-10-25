import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_NEW_JIRA_TICKET)
export class OnNewJiraTicketHistoryDTO {
  type: ActionTypes.ON_NEW_JIRA_TICKET;
  lastCreationTimestamp: number = 0;
}
