// THIS IS ONLY FOR EXAMPLE, YOU CAN DELETE THIS FILE AFTER MORE ACTIONS ARE CREATED
import { ActionTypes } from "../actions/action-types.enum";

export interface ExampleActionHistoryDTO {
    type: ActionTypes.EXAMPLE_ACTION;
    exampleHistory: string[];
}