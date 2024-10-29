import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  MongoDBService,
  getAuthorizationToken,
  AuthorizationsTypes,
  SpotifyAPI,
} from "@area/shared";

export const handlePlayRandomSpotifyLikedSongReaction: ReactionFunction =
  async (packet: AreaPacket, database: MongoDBService) => {
    const { token } = await getAuthorizationToken(
      packet.user_id,
      AuthorizationsTypes.SPOTIFY,
      database,
    );

    const spotify = new SpotifyAPI(token);

    await spotify.playRandomLikedTrack();
  };
