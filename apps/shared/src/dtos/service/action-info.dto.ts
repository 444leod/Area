import { ApiProperty, } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ActionTypes } from "../actions";
import { ActionParam } from "./action-param.class";

export class ActionInfo {
    @ApiProperty()
    @IsEmail()
    name: string

    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsNotEmpty()
    @ApiProperty()
    type: ActionTypes

    @ApiProperty({ type: [Object] })
    @ValidateNested()
    params: ActionParam[];
}
