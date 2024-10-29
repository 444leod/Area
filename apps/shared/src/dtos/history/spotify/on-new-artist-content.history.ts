import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_NEW_ARTIST_CONTENT)
export class OnNewArtistContentHistory {
  type: ActionTypes.ON_NEW_ARTIST_CONTENT;
  contentIds: string[] | null = null;
}
