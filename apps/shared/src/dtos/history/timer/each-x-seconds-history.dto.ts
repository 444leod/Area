import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.EACH_X_SECONDS)
export class EachXSecondsHistoryDTO {
  type: ActionTypes.EACH_X_SECONDS;
  lastExecutionTimestamp: number = 0;
}
