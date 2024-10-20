import { ExampleActionHistoryDTO } from './example-action-history.dto';
import { EachXSecondsHistoryDTO } from './timer/each-x-seconds-history.dto';
import { OnYoutubeVideoPostedHistoryDTO } from './youtube/on-youtube-video-posted-history.dto';
import { OnNewJiraTicketHistoryDTO } from './jira/on-new-jira-ticket-history.dto';
import {OnNewJiraProjectHistoryDTO} from "./jira/on-new-jira-project-history.dto";
import { OnNewGithubRepositoryHistoryDTO } from './github/on-new-github-repository-history.dto';
import { OnPullRequestStateHistoryDTO } from './github/on-pull-request-state-history.dto';

export type AnyHistoryDTO = ExampleActionHistoryDTO
    | EachXSecondsHistoryDTO
    | OnYoutubeVideoPostedHistoryDTO
    | OnNewJiraTicketHistoryDTO
    | OnNewJiraProjectHistoryDTO
    | OnNewGithubRepositoryHistoryDTO
    | OnPullRequestStateHistoryDTO;