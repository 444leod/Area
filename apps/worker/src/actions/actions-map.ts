import { ActionFunction } from "./action-function";
import { handleExampleAction } from "./example/example";
import { handleEachXSecondsAction } from "./timer/each-x-seconds-action";
import { handleYoutubeVideoPostedAction } from "./youtube/on-youtube-video-posted";
import { handleNewJiraTicketAction } from "./jira/on-new-jira-ticket";
import { handleNewJiraProjectAction } from "./jira/on-new-jira-project";
import { handleNewGithubRepositoryAction } from "./github/on-new-github-repository";
import { handleOnPullRequestStateAction } from "./github/on-pull-request-state";
import { handleOnNewYoutubeVideoInPlaylistAction } from "./youtube/on-video-in-playlist";
import { handleOnSpotifyPlaylistUpdateAction } from "./spotify/on-spotify-playlist-update";
import { handleOnNewArtistContentAction } from "./spotify/on-artiste-new-content";
import { handleOnNewGoogleTaskAction } from "./google-tasks/on-new-google-task";
import { handleOnGoogleTaskExpiredAction } from "./google-tasks/on-google-task-expired";
import { handleRiotGameEnd } from "./riot/on-game-end";

type ActionMap = {
  [string: string]: ActionFunction;
};

export const actionsMap: ActionMap = {
  EXAMPLE_ACTION: handleExampleAction,
  EACH_X_SECONDS: handleEachXSecondsAction,
  ON_YOUTUBE_VIDEO_POSTED: handleYoutubeVideoPostedAction,
  ON_NEW_JIRA_TICKET: handleNewJiraTicketAction,
  ON_NEW_JIRA_PROJECT: handleNewJiraProjectAction,
  ON_NEW_GITHUB_REPOSITORY: handleNewGithubRepositoryAction,
  ON_PULL_REQUEST_STATE: handleOnPullRequestStateAction,
  ON_NEW_VIDEO_IN_PLAYLIST: handleOnNewYoutubeVideoInPlaylistAction,
  ON_SPOTIFY_PLAYLIST_UPDATE: handleOnSpotifyPlaylistUpdateAction,
  ON_NEW_ARTIST_CONTENT: handleOnNewArtistContentAction,
  ON_NEW_GOOGLE_TASK: handleOnNewGoogleTaskAction,
  ON_GOOGLE_TASK_EXPIRED: handleOnGoogleTaskExpiredAction,
  ON_RIOT_GAME_END: handleRiotGameEnd,
};
