import { ReactionFunction } from "./reaction-function";
import { handleExampleReaction } from "./example/example";
import { handleCreateGoogleTaskReaction } from "./google-tasks/create-google-task";
import { handleSendEmailReaction } from "./email/send-email";
import { handleSendMessageToDiscordWebhookReaction } from "./discord/send-message-to-discord-webhook";
import { handleSendScrobbleReportByMailReaction } from "./last-fm/send-scrobble-report-by-mail";
import { handleSendAlbumsReportByMailReaction } from "./last-fm/send-albums-report-by-mail";
import { handleSendArtistsReportByMailReaction } from "./last-fm/send-artists-report-by-mail";
import { handleCommentGithubIssueReaction } from "./github/comment-github-issue";
import { handleCommentYoutubeVideoReaction } from "./youtube/comment-youtube-video";
import { handleCreateJiraTicketReaction } from "./jira/create-jira-ticket";
import { handlePlayRandomSpotifyLikedSongReaction } from "./spotify/play-random-liked-song-on-spotify";

type ReactionMap = {
  [string: string]: ReactionFunction;
};

export const reactionsMap: ReactionMap = {
  EXAMPLE_REACTION: handleExampleReaction,
  CREATE_GOOGLE_TASK: handleCreateGoogleTaskReaction,
  SEND_EMAIL: handleSendEmailReaction,
  SEND_MESSAGE_TO_DISCORD_WEBHOOK: handleSendMessageToDiscordWebhookReaction,
  COMMENT_GITHUB_ISSUE: handleCommentGithubIssueReaction,
  SEND_SCROBBLE_REPORT_BY_MAIL: handleSendScrobbleReportByMailReaction,
  SEND_ALBUMS_REPORT_BY_MAIL: handleSendAlbumsReportByMailReaction,
  SEND_ARTISTS_REPORT_BY_MAIL: handleSendArtistsReportByMailReaction,
  COMMENT_YOUTUBE_VIDEO: handleCommentYoutubeVideoReaction,
  CREATE_JIRA_TICKET: handleCreateJiraTicketReaction,
  PLAY_RANDOM_SPOTIFY_LIKED_SONG: handlePlayRandomSpotifyLikedSongReaction,
};
