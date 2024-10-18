import { ActionFunction } from '../action-function';
import {
    MongoDBService,
    AreaPacket,
    OnNewJiraTicketHistoryDTO,
    getJiraDomains,
    getNewAtlassianToken,
    getDomainsTicketsAfterDate,
} from '@area/shared';

function getTicketFields(ticket: any): string[] {
    const fields = ticket.fields;
    const fieldsArray = [];

    if (fields.issuetype) fieldsArray.push(`Type: ${fields.issuetype.name}`);
    if (fields.priority) fieldsArray.push(`Priority: ${fields.priority.name}`);
    if (fields.status) fieldsArray.push(`Status: ${fields.status.name}`);

    return fieldsArray;
}

export const handleNewJiraTicketAction: ActionFunction = async (packet: AreaPacket, database: MongoDBService) => {
    const atlassian_token = await database.getAuthorizationData(packet.user_id, 'ATLASSIAN');
    if (!atlassian_token) {
        console.error('atlassian token not found.');
        return null;
    }

    const new_tokens = await getNewAtlassianToken(atlassian_token);

    if (new_tokens === null) {
        return null;
    }

    await database.updateAuthorizationData(packet.user_id, 'ATLASSIAN', new_tokens);

    const area = packet.area;
    const history = area.action.history as OnNewJiraTicketHistoryDTO;

    const domains = await getJiraDomains(atlassian_token);

    if (domains === null || domains.length === 0) {
        return null;
    }

    const date = history.lastCreationTimestamp ? new Date(history.lastCreationTimestamp) : new Date(0);
    const tickets = await getDomainsTicketsAfterDate(domains, atlassian_token, date);

    if (history.lastCreationTimestamp === null || tickets === null || tickets.length === 0) {
        history.lastCreationTimestamp = new Date().getTime();
        area.action.history = history;
        await database.updateAreaHistory(packet.user_id, area);
        return null;
    }

    const afterTickets = tickets.filter((ticket: any) => new Date(ticket.fields.created) > date);

    if (afterTickets.length === 0) {
        return null;
    }

    const ticket = afterTickets.sort((a: any, b: any) => new Date(b.fields.created).getTime() - new Date(a.fields.created).getTime())[0];

    history.lastCreationTimestamp = new Date(ticket.fields.created).getTime();
    area.action.history = history;

    await database.updateAreaHistory(packet.user_id, area);

    const fields = getTicketFields(ticket);

    packet.data = {
        title: `The ticket ${ticket.key} "${ticket.fields.summary || 'missing summary'}" has been created.`,
        body: fields.length > 0 ? fields.join('\n') : 'No informations',
        username: ticket.fields.assignee?.displayName || undefined,
        picture: ticket.fields.assignee?.avatarUrls['48x48'] || undefined,
        date: new Date(ticket.fields.created),
    };

    return packet;
};
