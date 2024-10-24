import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ActionTypes } from "../actions";

export class ServiceParam {
    @ApiProperty()
    name: string;

    @ApiProperty()
    details?: string

    @ApiProperty()
    type: 'string' | 'number' | 'date' | 'text' | 'boolean' | 'enum'

    @ApiProperty({ type: [String] })
    items?: string[]

    @ApiProperty()
    required: boolean
}
