import { ActionFunction } from '../action-function';
import {
    MongoDBService,
    AreaPacket,
    OnNewGithubRepositoryHistoryDTO,
    getSortedUserRepositoriesSince,
    getAuthorizationToken,
} from '@area/shared';

export const handleNewGithubRepositoryAction: ActionFunction = async (packet: AreaPacket, database: MongoDBService) => {
    const { token } = await getAuthorizationToken(packet.user_id, 'GITHUB', database);

    const area = packet.area;
    const history = area.action.history as OnNewGithubRepositoryHistoryDTO;

    if (history.lastCreationTimestamp === null || history.lastCreationTimestamp === undefined) {
        history.lastCreationTimestamp = new Date().getTime();
        area.action.history = history;
        await database.updateAreaHistory(packet.user_id, area);
        return null;
    }
    let repos = await getSortedUserRepositoriesSince(token, new Date(history.lastCreationTimestamp), 'created_at', 'desc');

    if (!repos) return null;

    repos = repos.filter((repo: any) => {
        return new Date(repo.created_at).getTime() > history.lastCreationTimestamp;
    });

    if (repos.length === 0) return null;

    const repo = repos[repos.length - 1];

    history.lastCreationTimestamp = new Date(repo.created_at).getTime();
    area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);

    //TODO: update with variables
    packet.data = {
        title: `A repository has been created: ${repo.name}`,
        body: `description: ${repo.description}\nurl: ${repo.html_url}\ncreated at: ${repo.created_at}`,
        username: repo.owner.login,
        picture: repo.owner.avatar_url,
        date: new Date(repo.created_at),
    };

    return packet;
};
