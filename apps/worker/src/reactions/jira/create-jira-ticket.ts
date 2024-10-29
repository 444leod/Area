import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  AuthorizationsTypes,
  getAuthorizationToken,
  MongoDBService,
  JiraAPI,
  JiraTicketCreate,
  CreateJiraTicketInfos,
  ValidationError,
} from "@area/shared";

export const handleCreateJiraTicketReaction: ReactionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.ATLASSIAN,
    database,
  );

  const area = packet.area;
  const reaction = area.reaction.informations as CreateJiraTicketInfos;

  const jira = new JiraAPI(token);
  await jira.init();

  const project = await jira.getProjectByKey(reaction.project_key);

  const issueTypes = project.issueTypes.find(
    (issueType) => issueType.name === reaction.issue_type || "Task",
  );

  if (!issueTypes)
    throw new ValidationError(
      `Issue type ${reaction.issue_type || "Task"} not found`,
    );

  const ticket: JiraTicketCreate = {
    fields: {
      summary: reaction.title,
      description: reaction.description,
      issuetype: {
        id: issueTypes.id,
      },
    },
  };

  if (reaction.assignee_name) {
    const members = await jira.getProjectMembers(project);

    const assignee = members.find(
      (member) => member.displayName === reaction.assignee_name,
    );

    if (!assignee)
      throw new ValidationError(`Assignee ${reaction.assignee_name} not found`);

    ticket.fields.assignee = {
      accountId: assignee.accountId,
    };
  }

  await jira.createTicket(project, ticket);
};
