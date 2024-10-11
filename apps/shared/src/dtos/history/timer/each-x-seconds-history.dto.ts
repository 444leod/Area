import { ActionTypes } from '../../actions';

export interface EachXSecondsHistoryDTO {
  type: ActionTypes.EACH_X_SECONDS;
  lastExecutionTimestamp: number;
}
