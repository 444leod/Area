import { ReactionFunction } from '../reaction-function';
import { MongoDBService, AreaPacket, CreatePullRequestCommentClass, createPullRequestComment } from '@area/shared';

export const handleCreatePullRequestCommentReaction: ReactionFunction = async (packet: AreaPacket, database: MongoDBService) => {
    const { token } = await database.getAuthorizationData(packet.user_id, 'GITHUB');
    if (!token) {
        console.error('github token not found.');
        return;
    }

    const area = packet.area;
    const reaction = area.reaction.informations as CreatePullRequestCommentClass;

    if (isNaN(Number(reaction.pull_request_number))) {
        console.error('pull request number is not a number.');
        return;
    }

    await createPullRequestComment(token, reaction.owner, reaction.repository, Number(reaction.pull_request_number), reaction.body);
    return;
};
