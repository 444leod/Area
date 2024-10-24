import { ActionFunction } from "../action-function";
import {
  MongoDBService,
  AreaPacket,
  getJiraDomains,
  getDomainsProjects,
  OnNewJiraProjectHistoryDTO,
  getAuthorizationToken,
  AuthorizationsTypes,
} from "@area/shared";

export const handleNewJiraProjectAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.ATLASSIAN,
    database,
  );

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

  const differenceProjects = projects.filter(
    (project: any) => !history.projectList.includes(project.key),
  );

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
    lead_picture_url: newProject.lead?.avatarUrls["48x48"] || undefined,
    category: newProject.projectCategory?.name || undefined,
    type: newProject.projectTypeKey || undefined,
    picture_url: newProject.avatarUrls["48x48"] || undefined,
  };

  return packet;
};
