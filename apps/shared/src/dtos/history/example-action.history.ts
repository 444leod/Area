import { ActionTypes } from "../actions";
import { History } from "./history.decorator";

@History(ActionTypes.EXAMPLE_ACTION)
export class ExampleActionHistory {
  type: ActionTypes.EXAMPLE_ACTION;

  // Set base value for automatic creation
  exampleHistory: string[] = [];
}
