import { google, youtube_v3 } from "googleapis";
import {isAxiosError} from "axios";

function getYoutubeClient(token: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );

  oauth2Client.setCredentials({
    access_token: token,
  });

  return google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
}

export async function getUserYoutubeChannelID(token: string) {
  const youtube = getYoutubeClient(token);

  const response = await youtube.channels.list({
    part: ["id"],
    mine: true,
  });

  return response.data.items[0].id;
}

export async function getChannelIdByUsername(
  username: string,
  token: string,
): Promise<string | null> {
  const youtube = getYoutubeClient(token);

  try {
    const response = await youtube.channels.list({
      part: ["id"],
      forUsername: username,
    });

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    return response.data.items[0].id;
  } catch (error) {
    console.error("Error fetching channel ID:", error);
    return null;
  }
}

export async function getChannelVideos(
  channelId: string,
  token: string,
): Promise<any[]> {
  const youtube = getYoutubeClient(token);

  try {
    const response = await youtube.search.list({
      part: ["snippet"],
      channelId: channelId,
      maxResults: 5,
      order: "date",
    });

    return response.data.items;
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    return [];
  }
}

export async function getPlaylistVideos(
  playlistId: string,
  token: string,
): Promise<youtube_v3.Schema$PlaylistItem[]> {
  const youtube = getYoutubeClient(token);

  let videos: youtube_v3.Schema$PlaylistItem[] = [];
  let nextPageToken: string | undefined = undefined;

  try {
    do {
      const response = await youtube.playlistItems.list({
        part: ["snippet", "contentDetails"],
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      if (response.data.items) {
        videos.push(...response.data.items);
      }

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return videos;
  } catch (error) {
    throw new Error("Error fetching playlist videos: " + error);
  }
}

export async function commentYoutubeVideo(
  token: string,
  videoId: string,
  text: string,
) {
  const youtube = getYoutubeClient(token);

  try {
    await youtube.commentThreads.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          channelId: await getUserYoutubeChannelID(token),
          videoId: videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text,
            },
          },
        },
      },
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error commenting video:", error.response?.data);
    } else {
        console.error("Error commenting video:", error);
    }
  }
}
