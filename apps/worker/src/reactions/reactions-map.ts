import { ReactionFunction } from "./reaction-function";
import { handleExampleReaction } from "./example/example";
import { handleCreateGoogleTaskReaction } from "./google-tasks/create-google-task";
import { handleSendEmailReaction } from "./email/send-email";
import { handleSendMessageToDiscordWebhookReaction } from "./discord/send-message-to-discord-webhook";
import { handleSendScrobbleReportByMailReaction } from "./last-fm/send-scrobble-report-by-mail";
import { handleSendAlbumsReportByMailReaction } from "./last-fm/send-albums-report-by-mail";
import { handleSendArtistsReportByMailReaction } from "./last-fm/send-artists-report-by-mail";
import { handleCreatePullRequestCommentReaction } from "./github/create-pull-request-comment";
import { handleCommentYoutubeVideoReaction } from "./youtube/comment-youtube-video";

type ReactionMap = {
  [string: string]: ReactionFunction;
};

export const reactionsMap: ReactionMap = {
  EXAMPLE_REACTION: handleExampleReaction,
  CREATE_GOOGLE_TASK: handleCreateGoogleTaskReaction,
  SEND_EMAIL: handleSendEmailReaction,
  SEND_MESSAGE_TO_DISCORD_WEBHOOK: handleSendMessageToDiscordWebhookReaction,
  CREATE_PULL_REQUEST_COMMENT: handleCreatePullRequestCommentReaction,
  SEND_SCROBBLE_REPORT_BY_MAIL: handleSendScrobbleReportByMailReaction,
  SEND_ALBUMS_REPORT_BY_MAIL: handleSendAlbumsReportByMailReaction,
  SEND_ARTISTS_REPORT_BY_MAIL: handleSendArtistsReportByMailReaction,
  COMMENT_YOUTUBE_VIDEO: handleCommentYoutubeVideoReaction,
};
