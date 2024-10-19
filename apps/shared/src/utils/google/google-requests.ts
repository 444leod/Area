import { google } from 'googleapis';

// TODO: update with AuthDTO
export async function getNewGoogleTokens(tokens: { token: string, refresh_token: string }): Promise<{ token: string, refresh_token: string }> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: tokens.token,
    refresh_token: tokens.refresh_token
  });

  const newTokens = await oauth2Client.refreshAccessToken();
  return {
    token: newTokens.credentials.access_token,
    refresh_token: newTokens.credentials.refresh_token
  };
}