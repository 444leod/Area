import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  AuthorizationsTypes,
  CreateGoogleTaskInfos,
  getAuthorizationToken,
  MongoDBService,
} from "@area/shared";
import { google } from "googleapis";

export const handleCreateGoogleTaskReaction: ReactionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.GOOGLE,
    database,
  );

  const reaction = packet.area.reaction.informations as CreateGoogleTaskInfos;

  const title = reaction.title;
  const body = reaction.body;

  const tasks = google.tasks("v1");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );

  oauth2Client.setCredentials({
    access_token: token,
  });

  await tasks.tasks.insert({
    auth: oauth2Client,
    tasklist: "@default",
    requestBody: {
      title: title,
      notes: body,
    },
  });
  return true;
};
