import { ActionFunction } from '../action-function';
import {
    MongoDBService,
    AreaPacket,
    getJiraDomains,
    getDomainsProjects,
    OnNewJiraProjectHistoryDTO,
    getAuthorizationToken,
    AuthorizationsTypes,
} from '@area/shared';

function getProjectBody(project: any): string[] {
    const lines = [];

    if (project.description && project.description.length > 0) lines.push(`description: ${project.description}`);
    if (project.self) lines.push(`url: ${project.self}`);
    if (project.projectCategory) lines.push(`category: ${project.projectCategory.name}`);
    if (project.projectTypeKey) lines.push(`type: ${project.projectTypeKey}`);

    return lines;
}

export const handleNewJiraProjectAction: ActionFunction = async (packet: AreaPacket, database: MongoDBService) => {
    const { token } = await getAuthorizationToken(packet.user_id, AuthorizationsTypes.ATLASSIAN, database);

    const area = packet.area;
    const history = area.action.history as OnNewJiraProjectHistoryDTO;

    const domains = await getJiraDomains(token);

    if (domains === null || domains.length === 0) {
        return null;
    }

    const projects = await getDomainsProjects(domains, token);

    if (history.projectList === null) {
        history.projectList = projects.map((project: any) => project.key);
        area.action.history = history;
        await database.updateAreaHistory(packet.user_id, area);
        return null;
    }

    if (projects === null || projects.length === 0) {
        return null;
    }

    const differenceProjects = projects.filter((project: any) => !history.projectList.includes(project.key));

    if (differenceProjects.length === 0) {
        return null;
    }

    const newProject = differenceProjects[0];

    history.projectList = projects.map((project: any) => project.key);
    area.action.history = history;

    await database.updateAreaHistory(packet.user_id, area);

    // packet.data = {
    //     title: `The ticket ${newProject.key} "${ticket.fields.summary || 'missing summary'}" has been created.`,
    //     body: fields.length > 0 ? fields.join('\n') : 'No informations',
    //     username: ticket.fields.assignee?.displayName || undefined,
    //     picture: ticket.fields.assignee?.avatarUrls['48x48'] || undefined,
    //     date: new Date(ticket.fields.created),
    // };

    const bodyLines = getProjectBody(newProject);

    packet.data = {
        title: `A project ${newProject.key} "${newProject.name}" has been created on jira.`,
        body: bodyLines && bodyLines.length > 0 ? bodyLines.join('\n') : 'No informations',
        username: newProject.lead?.displayName || undefined,
        picture: newProject.lead?.avatarUrls['48x48'] || newProject.avatarUrls['48x48'],
        date: new Date(),
    };

    return packet;
};
