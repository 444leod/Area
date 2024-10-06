import { ReactionFunction } from '../reaction-function';
import { AreaPacket, CreateGoogleTaskInfos } from '@shared/src';
import { google } from 'googleapis';

export const handleCreateGoogleTaskReaction: ReactionFunction = async (packet: AreaPacket) => {
    const reaction = packet.area.reaction.informations as CreateGoogleTaskInfos;
    let title: string;
    let body: string;

    if (!reaction.content) {
        title = packet.data?.title || 'title';
        body = packet.data?.body || 'body';
    } else {
        title = reaction.content?.title || 'title';
        body = reaction.content?.body || 'body';
    }

    const tasks = google.tasks('v1');

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL,
    );

    //TODO: retrieve token from database
    oauth2Client.setCredentials({
        access_token: process.env.MY_GOOGLE_TOKEN,
    });

    await tasks.tasks.insert({
        auth: oauth2Client,
        tasklist: '@default',
        requestBody: {
            title: title,
            notes: body,
        },
    });
};
