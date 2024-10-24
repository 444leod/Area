import { ActionTypes } from "../../actions";

export interface OnPullRequestStateHistoryDTO {
  type: ActionTypes.ON_PULL_REQUEST_STATE;
  lastUpdateTimestamp: number;
}
