import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_GOOGLE_TASK_EXPIRED)
export class OnGoogleTaskExpiredHistory {
  type: ActionTypes.ON_GOOGLE_TASK_EXPIRED;
  taskIds: string[] | null = null;
}
