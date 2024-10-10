import { Action, ActionTypes, EachXSecondsActionInfos, EachXSecondsHistoryDTO, ExampleActionInfos } from "@area/shared";
import { ActionBuilder } from "./action.builder";

export class EachXSecondsActionBuilder implements ActionBuilder {
    build(dto: EachXSecondsActionInfos) : Action {
        return {
            is_webhook: false,
            service_id: undefined,
            informations: dto,
            history: {
                type: ActionTypes.EACH_X_SECONDS,
                lastExecutionTimestamp: undefined
            }
        }
    }
}