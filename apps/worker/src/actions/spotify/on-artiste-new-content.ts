import { ActionFunction } from "../action-function";
import {
  AreaPacket,
  AuthorizationsTypes,
  getAuthorizationToken,
  MongoDBService,
  OnNewArtistContentInfos,
  OnNewArtistContentHistory,
  SpotifyAPI,
  NewArtistContentType,
} from "@area/shared";

export const handleOnNewArtistContentAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.SPOTIFY,
    database,
  );

  const area = packet.area;
  const action = area.action.informations as OnNewArtistContentInfos;
  const history = area.action.history as OnNewArtistContentHistory;

  const spotify = new SpotifyAPI(token);

  const artist = await spotify.getArtistByName(action.artist_name);
  const releases =
    action.content_type === NewArtistContentType.ANY
      ? await spotify.getArtistReleases(artist.id)
      : (await spotify.getArtistReleasesSortedByDateReducedByType(artist.id))[action.content_type] || [];

  if (!history.contentIds) {
    history.contentIds = releases.map((release) => release.id);
    area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);
    return null;
  }

  const newContent = releases.filter((release) => !history.contentIds?.includes(release.id));

  if (newContent.length === 0) {
    return null;
  }

  const content = newContent[0];

  history.contentIds.push(content.id);
  area.action.history = history;
  await database.updateAreaHistory(packet.user_id, area);

  packet.data = {
    name: content.name,
    url: content.external_urls.spotify,
    tracks_number: content.total_tracks,
    type: content.album_type,
    cover_url: content.images?.length > 0 ? content.images[0].url : null,
    artists: content.artists.map((artist) => artist.name),
    released_at: new Date(content.release_date).toString(),
    release_date: new Date(content.release_date).toLocaleDateString(),
    release_time: new Date(content.release_date).toLocaleTimeString(),
  };

  return packet;
};
