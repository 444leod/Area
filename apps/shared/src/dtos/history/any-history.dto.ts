import { ExampleActionHistoryDTO } from './example-action-history.dto';
import { EachXSecondsHistoryDTO } from './timer/each-x-seconds-history.dto';
import { OnYoutubeVideoPostedHistoryDTO } from './youtube/on-youtube-video-posted-history.dto';
import { OnNewJiraTicketHistoryDTO } from './jira/on-new-jira-ticket-history.dto';

export type AnyHistoryDTO = ExampleActionHistoryDTO
    | EachXSecondsHistoryDTO
    | OnYoutubeVideoPostedHistoryDTO
    | OnNewJiraTicketHistoryDTO;