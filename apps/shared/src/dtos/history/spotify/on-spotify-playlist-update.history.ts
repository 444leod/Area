import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";
import { PlaylistTrack } from "../../../utils";

@History(ActionTypes.ON_SPOTIFY_PLAYLIST_UPDATE)
export class OnSpotifyPlaylistUpdateHistory {
  type: ActionTypes.ON_SPOTIFY_PLAYLIST_UPDATE;

  title: string | null = null;
  description: string | null = null;
  tracks: PlaylistTrack[] | null = null;
  lastRemovedTrack: PlaylistTrack | null = null;
  lastAddedTrack: PlaylistTrack | null = null;
}
