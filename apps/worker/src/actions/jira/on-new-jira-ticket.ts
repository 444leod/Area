import { ActionFunction } from "../action-function";
import {
  MongoDBService,
  AreaPacket,
  OnNewJiraTicketHistory,
  getJiraDomains,
  getDomainsTicketsAfterDate,
  getAuthorizationToken,
  AuthorizationsTypes,
} from "@area/shared";

export const handleNewJiraTicketAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.ATLASSIAN,
    database,
  );

  const area = packet.area;
  const history = area.action.history as OnNewJiraTicketHistory;

  const domains = await getJiraDomains(token);

  if (domains === null || domains.length === 0) {
    return null;
  }

  const date = history.lastCreationTimestamp
    ? new Date(history.lastCreationTimestamp)
    : new Date(0);
  const tickets = await getDomainsTicketsAfterDate(domains, token, date);

  if (history.lastCreationTimestamp === null) {
    history.lastCreationTimestamp = new Date().getTime();
    area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);
    return null;
  }

  if (tickets === null || tickets.length === 0) {
    return null;
  }

  const afterTickets = tickets.filter(
    (ticket: any) => new Date(ticket.fields.created) > date,
  );

  if (afterTickets.length === 0) {
    return null;
  }

  const ticket = afterTickets.sort(
    (a: any, b: any) =>
      new Date(b.fields.created).getTime() -
      new Date(a.fields.created).getTime(),
  )[0];

  history.lastCreationTimestamp = new Date(ticket.fields.created).getTime();
  area.action.history = history;

  await database.updateAreaHistory(packet.user_id, area);

  packet.data = {
    title: ticket.fields.summary,
    key: ticket.key,
    assignee: ticket.fields.assignee?.displayName || undefined,
    assignee_picture_url:
      ticket.fields.assignee?.avatarUrls["48x48"] || undefined,
    reporter: ticket.fields.reporter?.displayName || undefined,
    reporter_picture_url:
      ticket.fields.reporter?.avatarUrls["48x48"] || undefined,
    created_at: new Date(ticket.fields.created).toString(),
    creation_time: new Date(ticket.fields.created).toLocaleTimeString(),
    creation_date: new Date(ticket.fields.created).toLocaleDateString(),
    project_name: ticket.fields.project.name,
    project_key: ticket.fields.project.key,
    project_picture_url: ticket.fields.project?.avatarUrls["48x48"],
    type: ticket.fields.issuetype?.name,
    priority: ticket.fields.priority?.name,
    status: ticket.fields.status?.name,
    labels: ticket.fields.labels.join(", ") || undefined,
  };

  return packet;
};
