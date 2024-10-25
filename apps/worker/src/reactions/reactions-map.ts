import { ReactionFunction } from "./reaction-function";
import { handleExampleReaction } from "./example/example";
import { handleCreateGoogleTaskReaction } from "./google-tasks/create-google-task";
import { handleSendEmailReaction } from "./email/send-email";
import { handleSendMessageToDiscordWebhookReaction } from "./discord/send-message-to-discord-webhook";
import { handleCreatePullRequestCommentReaction } from "./github/create-pull-request-comment";
import { handleCreateJiraTicketReaction } from "./jira/create-jira-ticket";

type ReactionMap = {
  [string: string]: ReactionFunction;
};

export const reactionsMap: ReactionMap = {
  EXAMPLE_REACTION: handleExampleReaction,
  CREATE_GOOGLE_TASK: handleCreateGoogleTaskReaction,
  SEND_EMAIL: handleSendEmailReaction,
  SEND_MESSAGE_TO_DISCORD_WEBHOOK: handleSendMessageToDiscordWebhookReaction,
  CREATE_PULL_REQUEST_COMMENT: handleCreatePullRequestCommentReaction,
  CREATE_JIRA_TICKET: handleCreateJiraTicketReaction,
};
