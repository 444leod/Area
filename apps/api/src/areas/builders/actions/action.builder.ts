import { ActionDTO, AnyActionDTO } from "@area/shared";

export abstract class ActionBuilder {
    abstract build (dto: AnyActionDTO) : ActionDTO;
}