import { google } from 'googleapis';

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
        version: 'v3',
        auth: oauth2Client,
    });

    // @ts-ignore
    const response = await youtube.channels.list({
        part: ['id'],
        mine: true,
    });

    // @ts-ignore
    return response.data.items[0].id;
}