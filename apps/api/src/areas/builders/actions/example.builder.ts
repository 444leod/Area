import { ActionTypes, AnyActionDTO, ExampleActionDTO } from "@area/shared";
import { ActionDTO } from "@area/shared";
import { ObjectId } from "mongodb";
import { ActionBuilder } from "./action.builder";

export class ExampleActionBuilder implements ActionBuilder {
    build(dto: ExampleActionDTO) : ActionDTO {
        return {
            isWebhook: false,
            service_id: new ObjectId(),
            informations: dto,
            history: {
                type: ActionTypes.EXAMPLE_ACTION,
                exampleHistory: []
            }
        }
    }
}