import { ActionFunction } from './action-function';
import { handleExampleAction } from './example/example';
import { handleEachXSecondsAction } from './timer/each-x-seconds-action';
import { handleYoutubeVideoPostedAction } from './youtube/on-youtube-video-posted';
import { handleNewJiraTicketAction } from './jira/on-new-jira-ticket';
import { handleNewJiraProjectAction } from './jira/on-new-jira-project';
import { handleNewGithubRepositoryAction } from './github/on-new-github-repository';

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
};
