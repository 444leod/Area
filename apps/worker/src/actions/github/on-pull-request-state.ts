import { ActionFunction } from '../action-function';
import {
    MongoDBService,
    AreaPacket,
    getRepositoryPullRequests,
    OnPullRequestStateClass,
    OnPullRequestStateHistoryDTO,
    getAuthorizationToken,
    AuthorizationsTypes,
} from '@area/shared';

export const handleOnPullRequestStateAction: ActionFunction = async (packet: AreaPacket, database: MongoDBService) => {
    const { token } = await getAuthorizationToken(packet.user_id, AuthorizationsTypes.GITHUB, database);

    const area = packet.area;
    const action = area.action.informations as OnPullRequestStateClass;
    const history = area.action.history as OnPullRequestStateHistoryDTO;

    if (history.lastUpdateTimestamp === null || history.lastUpdateTimestamp === undefined) {
        history.lastUpdateTimestamp = new Date().getTime();
        area.action.history = history;
        await database.updateAreaHistory(packet.user_id, area);
        return null;
    }
    let prs = await getRepositoryPullRequests({
        token: token,
        owner: action.owner,
        repo: action.repository,
        since: new Date(history.lastUpdateTimestamp),
        state: action.state,
        sort: 'updated_at',
        direction: 'desc',
    });

    if (!prs) return null;

    prs = prs.filter((pr: any) => {
        return new Date(pr.updated_at).getTime() > history.lastUpdateTimestamp;
    });

    if (prs.length === 0) return null;

    const pr = prs[prs.length - 1];

    history.lastUpdateTimestamp = new Date(pr.updated_at).getTime();
    area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);

    //TODO: update with variables
    packet.data = {
        title: `A repository has been updated: ${pr.title}`,
        body: `description: ${pr.body}\nurl: ${pr.html_url}\nupdated at: ${pr.updated_at}\nstate: ${pr.state}`,
        username: pr.user.login,
        picture: pr.user.avatar_url,
        date: new Date(pr.updated_at),
    };

    return packet;
};
