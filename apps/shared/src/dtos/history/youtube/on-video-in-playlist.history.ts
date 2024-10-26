import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_NEW_VIDEO_IN_PLAYLIST)
export class OnNewVideoInPlaylistHistory {
    type: ActionTypes.ON_NEW_VIDEO_IN_PLAYLIST;
    videoIds: string[] = [];
}
