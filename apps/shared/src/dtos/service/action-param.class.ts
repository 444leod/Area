import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ActionTypes } from "../actions";

export class ActionParam {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    details?: string

    @ApiProperty()
    @IsEnum(ActionTypes)
    type: ActionTypes

    @ApiProperty()
    @IsBoolean()
    required: boolean
}
