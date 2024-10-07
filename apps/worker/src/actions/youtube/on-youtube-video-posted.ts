import { ActionFunction } from '../action-function';
import { MongoDBService, AreaPacket, OnYoutubeVideoPostedClass, OnYoutubeVideoPostedHistoryDTO, getChannelVideos } from '@area/shared';
import { ObjectId } from 'mongodb';

export const handleYoutubeVideoPostedAction: ActionFunction = async (packet: AreaPacket, database: MongoDBService) => {
    const user = await database
        .db()
        .collection('users')
        .findOne({ _id: new ObjectId(packet.user_id) });

    const tokens = user?.user_authorization;
    if (!tokens || tokens.length === 0) {
        return null;
    }

    const google_token = tokens.find((token: any) => token.type === 'GOOGLE')?.token;
    if (!google_token) {
        return null;
    }

    const area = packet.area;
    const action = area.action.informations as OnYoutubeVideoPostedClass;
    const history = area.action.history as OnYoutubeVideoPostedHistoryDTO;

    const videos = await getChannelVideos(action.user_id, google_token);

    if (videos === null) {
        return null;
    }

    let newVideos = videos.map((video) => {
        return {
            id: video?.id?.videoId,
            title: video?.snippet?.title,
            description: video?.snippet?.description,
            date: new Date(video?.snippet?.publishedAt || 0),
        };
    });

    let video;

    if (history.lastVideoTimestamp === undefined || history.lastVideoTimestamp === 0) {
        history.lastVideoTimestamp = newVideos[0].date.getTime();
        video = undefined;

        // FOR TESTING PURPOSES, DO NOT DELETE
        // history.lastVideoTimestamp = newVideos[newVideos.length - 1].date.getTime();
        // video = newVideos[newVideos.length - 1];
    } else {
        newVideos = newVideos.filter((video) => video.date.getTime() > history.lastVideoTimestamp);
        if (newVideos.length === 0) {
            return null;
        }

        video = newVideos[newVideos.length - 1];
        history.lastVideoTimestamp = video.date.getTime();
    }

    packet.area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);
    if (video === undefined) {
        return null;
    }

    packet.data = {
        title: video.title || 'title',
        body: video.description || '',
    };

    return packet;
};
