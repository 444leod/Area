import { IsEnum } from "class-validator";
import { ActionTypes } from "./action-types.enum";
import { ExampleActionInfos } from "./example-action.dto";

export class BaseActionInfos {
    @IsEnum(ActionTypes)
    type: ActionTypes
}

export type ActionInfos = ExampleActionInfos; // | T | U | V | ...
