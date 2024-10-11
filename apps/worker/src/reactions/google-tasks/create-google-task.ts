import { ReactionFunction } from "../reaction-function";
import { AreaPacket, CreateGoogleTaskInfos } from "@shared/src";
import { MongoDBService } from "@area/shared";
import { google } from "googleapis";

export const handleCreateGoogleTaskReaction: ReactionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const google_token = await database.getAuthorizationData(
    packet.user_id,
    "GOOGLE",
  );
  if (!google_token) {
    console.error("Google token not found.");
    return;
  }
  const reaction = packet.area.reaction.informations as CreateGoogleTaskInfos;

  const title = reaction.content?.title || "title";
  const body = reaction.content?.body || "body";

  const tasks = google.tasks("v1");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );

  oauth2Client.setCredentials({
    access_token: google_token,
  });

  try {
    await tasks.tasks.insert({
      auth: oauth2Client,
      tasklist: "@default",
      requestBody: {
        title: title,
        notes: body,
      },
    });
  } catch (error: any) {
    console.error("Error in creating google task: ", error);
  }
};
