import { ExampleActionHistoryDTO } from './example-action-history.dto';
import { EachXSecondsHistoryDTO } from './timer/each-x-seconds-history.dto';

export type AnyHistoryDTO = ExampleActionHistoryDTO | EachXSecondsHistoryDTO;