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

    if (history.lastCreationTimestamp === null) {
        history.lastCreationTimestamp = new Date().getTime();
        area.action.history = history;
        await database.updateAreaHistory(packet.user_id, area);
        return null;
    }

    if (tickets === null || tickets.length === 0) {
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

    packet.data = {
        title: ticket.fields.summary,
        key: ticket.key,
        assignee: ticket.fields.assignee?.displayName || undefined,
        assignee_picture_url: ticket.fields.assignee?.avatarUrls['48x48'] || undefined,
        reporter: ticket.fields.reporter?.displayName || undefined,
        reporter_picture_url: ticket.fields.reporter?.avatarUrls['48x48'] || undefined,
        created_at: new Date(ticket.fields.created).toString(),
        creation_time: new Date(ticket.fields.created).toLocaleTimeString(),
        creation_date: new Date(ticket.fields.created).toLocaleDateString(),
        project_name: ticket.fields.project.name,
        project_key: ticket.fields.project.key,
        project_picture_url: ticket.fields.project?.avatarUrls['48x48'],
        type: ticket.fields.issuetype?.name,
        priority: ticket.fields.priority?.name,
        status: ticket.fields.status?.name,
        labels: ticket.fields.labels.join(', ') || undefined,
    };

    return packet;
};
