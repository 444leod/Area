import { ActionFunction } from "./action-function";
import { handleExampleAction } from "./example/example";
import { handleEachXSecondsAction } from "./timer/each-x-seconds-action";
import { handleYoutubeVideoPostedAction } from "./youtube/on-youtube-video-posted";
import { handleNewJiraTicketAction } from "./jira/on-new-jira-ticket";
import { handleNewJiraProjectAction } from "./jira/on-new-jira-project";
import { handleNewGithubRepositoryAction } from "./github/on-new-github-repository";
import { handleOnPullRequestStateAction } from "./github/on-pull-request-state";
import { handleOnNewYoutubeVideoInPlaylistAction } from "./youtube/on-video-in-playlist";

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
};
