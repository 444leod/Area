import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_NEW_GOOGLE_TASK)
export class OnNewGoogleTaskHistory {
  type: ActionTypes.ON_NEW_GOOGLE_TASK;
  taskIds: string[] | null = null;
}
