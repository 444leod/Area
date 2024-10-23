import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ReactionTypes } from "../reactions";

export class ReactionParam {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    details?: string

    @ApiProperty()
    @IsEnum(ReactionTypes)
    type: ReactionTypes

    @ApiProperty()
    @IsBoolean()
    required: boolean
}
