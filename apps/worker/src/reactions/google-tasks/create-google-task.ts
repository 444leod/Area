import { ReactionFunction } from '../reaction-function';
import { AreaPacket, CreateGoogleTaskInfos } from '@shared/src';
import { MongoDBService } from '@area/shared';
import { google } from 'googleapis';
import { ObjectId } from 'mongodb';

export const handleCreateGoogleTaskReaction: ReactionFunction = async (packet: AreaPacket, database: MongoDBService) => {
    const user = await database
        .db()
        .collection('users')
        .findOne({ _id: new ObjectId(packet.user_id) });

    const tokens = user?.authorizations;
    if (!tokens || tokens.length === 0) {
        return;
    }

    const google_token = tokens.find((token: any) => token.type === 'GOOGLE')?.token;
    if (!google_token) {
        return;
    }
    const reaction = packet.area.reaction.informations as CreateGoogleTaskInfos;

    const title = reaction.content?.title || 'title';
    const body = reaction.content?.body || 'body';

    const tasks = google.tasks('v1');

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL,
    );

    oauth2Client.setCredentials({
        access_token: google_token,
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
