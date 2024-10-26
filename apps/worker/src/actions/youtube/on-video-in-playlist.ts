import { ActionFunction } from "../action-function";
import {
  MongoDBService,
  AreaPacket,
  OnNewVideoInPlaylistInfos,
  OnNewVideoInPlaylistHistory,
  getAuthorizationToken,
  AuthorizationsTypes,
  getPlaylistVideos,
} from "@area/shared";

export const handleOnNewYoutubeVideoInPlaylistAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GOOGLE,
    database,
  );

  const area = packet.area;
  const action = area.action.informations as OnNewVideoInPlaylistInfos;
  const history = area.action.history as OnNewVideoInPlaylistHistory;
  const oldVideoHistory = history.videoIds;

  let videos = await getPlaylistVideos(action.playlist_id, token);

  videos = videos.filter((video) => video.snippet?.resourceId?.videoId);

  if (videos.length === 0) {
    return null;
  }

  let video;

  if (!history.videoIds || history.videoIds.length === 0) {
    history.videoIds = videos.map(
      (video) => video.snippet?.resourceId?.videoId || "",
    );

    video = videos[videos.length - 1];
  } else {
    const newVideos = videos.filter(
      (video) =>
        video.snippet?.resourceId?.videoId &&
        !history.videoIds.includes(video.snippet?.resourceId?.videoId),
    );

    if (newVideos.length === 0) {
      video = null;
    } else {
      video = newVideos[newVideos.length - 1];
    }

    const newVideoIds = newVideos
      .map((video) => video.snippet?.resourceId?.videoId || "")
      .filter(Boolean);
    history.videoIds = videos
      .map((video) => video.snippet?.resourceId?.videoId || "")
      .filter(Boolean)
      .filter((video) => !newVideoIds.includes(video));
    if (video) history.videoIds.push(video.snippet?.resourceId?.videoId || "");
  }

  if (
    oldVideoHistory.length !== history.videoIds.length ||
    !oldVideoHistory.every((elem) => history.videoIds.includes(elem))
  ) {
    packet.area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);
  }

  if (!video) {
    return null;
  }

  packet.data = {
    title: video.snippet?.title,
    description: video.snippet?.description,
    url: `https://www.youtube.com/watch?v=${video.snippet?.resourceId?.videoId}`,
    published_at: new Date(video.snippet?.publishedAt || "").toLocaleString(),
    publication_time: new Date(
      video.snippet?.publishedAt || "",
    ).toLocaleTimeString(),
    publication_date: new Date(
      video.snippet?.publishedAt || "",
    ).toLocaleDateString(),
    channel_title: video.snippet?.channelTitle,
    channel_id: video.snippet?.channelId,
    thumbnail_url:
      video.snippet?.thumbnails?.high?.url ||
      video.snippet?.thumbnails?.default?.url,
  };

  return packet;
};
