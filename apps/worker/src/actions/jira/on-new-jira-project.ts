import { ActionFunction } from '../action-function';
import {
    MongoDBService,
    AreaPacket,
    getJiraDomains,
    getNewAtlassianToken,
    getDomainsProjects,
    OnNewJiraProjectHistoryDTO,
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
    const history = area.action.history as OnNewJiraProjectHistoryDTO;

    const domains = await getJiraDomains(atlassian_token);

    if (domains === null || domains.length === 0) {
        return null;
    }

    const projects = await getDomainsProjects(domains, atlassian_token);

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

    packet.data = {
        name: newProject.name,
        key: newProject.key,
        description: newProject.description || undefined,
        lead: newProject.lead?.displayName || undefined,
        lead_picture_url: newProject.lead?.avatarUrls['48x48'] || undefined,
        category: newProject.projectCategory?.name || undefined,
        type: newProject.projectTypeKey || undefined,
        picture_url: newProject.avatarUrls['48x48'] || undefined,
    };

    return packet;
};
