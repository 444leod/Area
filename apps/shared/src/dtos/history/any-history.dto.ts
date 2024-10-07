import { ExampleActionHistoryDTO } from './example-action-history.dto';
import { EachXSecondsHistoryDTO } from './timer/each-x-seconds-history.dto';
import { OnYoutubeVideoPostedHistoryDTO } from './youtube/on-youtube-video-posted-history.dto';

export type AnyHistoryDTO = ExampleActionHistoryDTO | EachXSecondsHistoryDTO | OnYoutubeVideoPostedHistoryDTO;