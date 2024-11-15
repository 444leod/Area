import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_YOUTUBE_VIDEO_POSTED)
export class OnYoutubeVideoPostedHistory {
  type: ActionTypes.ON_YOUTUBE_VIDEO_POSTED;
  lastVideoTimestamp: number = 0;
}
