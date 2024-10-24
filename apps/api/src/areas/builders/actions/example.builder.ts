import { Action, ActionTypes, ExampleActionInfos } from "@area/shared";
import { ActionBuilder } from "./action.builder";

export class ExampleActionBuilder implements ActionBuilder {
  build(dto: ExampleActionInfos): Action {
    return {
      is_webhook: false,
      service_id: undefined,
      informations: dto,
      history: {
        type: ActionTypes.EXAMPLE_ACTION,
        exampleHistory: [],
      },
    };
  }
}
