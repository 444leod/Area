import { ApiProperty, } from "@nestjs/swagger";
import { ActionTypes } from "../actions";
import { ActionParam } from "./action-param.class";
import { ActionVariable } from "./action-variable.class";

export class ActionInfo {
    @ApiProperty()
    name: string

    @ApiProperty()
    description: string

    @ApiProperty()
    type: ActionTypes

    @ApiProperty({ type: [ActionParam] })
    params: ActionParam[];

    @ApiProperty({ type: [ActionVariable] })
    variables: ActionVariable[];
}
