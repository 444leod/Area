// THIS IS ONLY FOR EXAMPLE, YOU CAN DELETE THIS FILE AFTER MORE ACTIONS ARE CREATED
import { ActionTypes } from "../../actions";

export interface EachXSecondsHistoryDTO {
    type: ActionTypes.EACH_X_SECONDS;
    lastExecutionTimestamp: number;
}