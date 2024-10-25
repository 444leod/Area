// THIS IS ONLY FOR EXAMPLE, YOU CAN DELETE THIS FILE AFTER MORE ACTIONS ARE CREATED
import { ActionTypes } from "../actions";
import { History } from "./history.decorator";

@History(ActionTypes.EXAMPLE_ACTION)
export class ExampleActionHistoryDTO {
  type: ActionTypes.EXAMPLE_ACTION;

  // Set base value for automatic creation
  exampleHistory: string[] = [];
}
