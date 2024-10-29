import { ReactionTypes } from "../reaction-types.enum";
import { BaseReactionInfos } from "../reaction-infos.class";
import { RegisterReaction } from "../reaction.decorator";

@RegisterReaction(ReactionTypes.PLAY_RANDOM_SPOTIFY_LIKED_SONG)
export class PlayRandomLikedSongOnSpotifyInfos extends BaseReactionInfos {
  type: ReactionTypes.PLAY_RANDOM_SPOTIFY_LIKED_SONG;
}
