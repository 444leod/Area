import { google } from "googleapis";

export async function getUserYoutubeChannelID(token: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );

  oauth2Client.setCredentials({
    access_token: token,
  });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  // @ts-ignore
  const response = await youtube.channels.list({
    part: ["id"],
    mine: true,
  });

  // @ts-ignore
  return response.data.items[0].id;
}

export async function getChannelIdByUsername(
  username: string,
  token: string,
): Promise<string | null> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );

  oauth2Client.setCredentials({
    access_token: token,
  });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  try {
    // @ts-ignore
    const response = await youtube.channels.list({
      part: ["id"],
      forUsername: username,
    });

    console.log(response);

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    // @ts-ignore
    return response.data.items[0].id;
  } catch (error) {
    console.error("Error fetching channel ID:", error);
    return null;
  }
}

export async function getChannelVideos(channelId: string, token: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );

  oauth2Client.setCredentials({
    access_token: token,
  });

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  // @ts-ignore
  const response = await youtube.search.list({
    part: ["snippet"],
    channelId: channelId,
    maxResults: 5,
    order: "date",
  });

  return response.data.items;
}
