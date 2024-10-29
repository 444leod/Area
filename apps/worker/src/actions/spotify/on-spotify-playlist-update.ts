import { ActionFunction } from "../action-function";
import {
  AreaPacket,
  AuthorizationsTypes,
  getAuthorizationToken,
  MongoDBService,
  OnSpotifyPlaylistUpdateInfos,
  OnSpotifyPlaylistUpdateHistory,
  SpotifyAPI,
  PlaylistTrack,
  SpotifyPlaylistUpdateType,
  Playlist,
} from "@area/shared";

async function updateHistory(
  playlist: Playlist,
  playlistItems: PlaylistTrack[],
  history: OnSpotifyPlaylistUpdateHistory,
  packet: AreaPacket,
  database: MongoDBService,
) {
  history.title = playlist.name;
  history.description = playlist.description;
  history.tracks = playlistItems;
  history.lastRemovedTrack = null;
  history.lastAddedTrack = null;

  packet.area.action.history = history;
  await database.updateAreaHistory(packet.user_id, packet.area);
}

export const handleOnSpotifyPlaylistUpdateAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.SPOTIFY,
    database,
  );

  const area = packet.area;
  const action = area.action.informations as OnSpotifyPlaylistUpdateInfos;
  const history = area.action.history as OnSpotifyPlaylistUpdateHistory;
  const oldHistory = { ...history };

  const spotify = new SpotifyAPI(token);
  await spotify.init();

  const playlist = action.playlist_id
    ? await spotify.getPlaylist(action.playlist_id)
    : await spotify.getLikedTrackPlaylist();

  const playlistItems = (
    action.playlist_id
      ? await spotify.getPlaylistTracks(action.playlist_id)
      : await spotify.getLikedTracks()
  ).filter((item: PlaylistTrack) => item.type === "track");

  if (!history.title) {
    await updateHistory(playlist, playlistItems, history, packet, database);
    return null;
  }

  const tracks = playlistItems.map((item) => item.id);
  const oldTracks = oldHistory.tracks?.map((item) => item.id);
  const removedTracks =
    oldTracks?.filter((track) => !tracks.includes(track)) || [];
  const addedTracks =
    tracks.filter((track) => !oldTracks?.includes(track)) || [];

  if (removedTracks.length > 0) {
    history.lastRemovedTrack = await spotify.getTrack(removedTracks[0]);
    history.tracks =
      history.tracks?.filter(
        (track) => track.id !== history.lastRemovedTrack?.id,
      ) || [];
  } else {
    history.lastRemovedTrack = null;
  }

  if (addedTracks.length > 0) {
    history.lastAddedTrack =
      playlistItems.find((item) => item.id === addedTracks[0]) || null;
    if (history.lastAddedTrack?.id) {
      history.tracks?.push(history.lastAddedTrack);
    }
  } else {
    history.lastAddedTrack = null;
  }

  history.title = playlist.name;
  history.description = playlist.description;

  packet.area.action.history = history;
  await database.updateAreaHistory(packet.user_id, packet.area);

  packet.data = {
    title: playlist.name,
    old_title: oldHistory.title,
    description: playlist.description,
    old_description: oldHistory.description,
    playlist_url: playlist.external_urls.spotify,
    last_added_track_id: history.lastAddedTrack?.id,
    last_added_track_name: history.lastAddedTrack?.name,
    last_added_track_artists: history.lastAddedTrack?.artists
      .map((artist) => artist.name)
      .join(", "),
    last_added_track_url: history.lastAddedTrack
      ? `https://open.spotify.com/track/${history.lastAddedTrack.id}`
      : null,
    last_deleted_track_id: history.lastRemovedTrack?.id,
    last_deleted_track_name: history.lastRemovedTrack?.name,
    last_deleted_track_artists: history.lastRemovedTrack?.artists
      .map((artist) => artist.name)
      .join(", "),
    last_deleted_track_url: history.lastRemovedTrack
      ? `https://open.spotify.com/track/${history.lastRemovedTrack.id}`
      : null,
  };

  switch (action.update_type) {
    case SpotifyPlaylistUpdateType.TITLE:
      if (oldHistory.title !== history.title) {
        packet.data.update_type = SpotifyPlaylistUpdateType.TITLE;
        return packet;
      }
      break;
    case SpotifyPlaylistUpdateType.DESCRIPTION:
      if (oldHistory.description !== history.description) {
        packet.data.update_type = SpotifyPlaylistUpdateType.DESCRIPTION;
        return packet;
      }
      break;
    case SpotifyPlaylistUpdateType.ADD:
      if (history.lastAddedTrack) {
        packet.data.update_type = SpotifyPlaylistUpdateType.ADD;
        return packet;
      }
      break;
    case SpotifyPlaylistUpdateType.REMOVE:
      if (history.lastRemovedTrack) {
        packet.data.update_type = SpotifyPlaylistUpdateType.REMOVE;
        return packet;
      }
      break;
    case SpotifyPlaylistUpdateType.ANY:
      if (
        oldHistory.title !== history.title ||
        oldHistory.description !== history.description ||
        history.lastAddedTrack ||
        history.lastRemovedTrack
      ) {
        packet.data.update_type =
          oldHistory.title !== history.title
            ? SpotifyPlaylistUpdateType.TITLE
            : oldHistory.description !== history.description
              ? SpotifyPlaylistUpdateType.DESCRIPTION
              : history.lastAddedTrack
                ? SpotifyPlaylistUpdateType.ADD
                : SpotifyPlaylistUpdateType.REMOVE;
        return packet;
      }
      break;
  }

  return null;
};
