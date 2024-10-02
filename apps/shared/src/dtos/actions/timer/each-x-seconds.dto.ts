import { ActionTypes } from "../action-types.dto";

export interface EachXSecondsDTO {
    type: ActionTypes.EACH_X_SECONDS;
    seconds: number;
}