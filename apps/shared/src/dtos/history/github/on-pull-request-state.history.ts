import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_PULL_REQUEST_STATE)
export class OnPullRequestStateHistory {
  type: ActionTypes.ON_PULL_REQUEST_STATE;
  lastUpdateTimestamp: number | null = null;
}
