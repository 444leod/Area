import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, ValidateNested } from "class-validator";
import { ReactionTypes } from "../reactions";
import { ReactionParam } from "./reaction-param.class";

export class ReactionInfo {
    @ApiProperty()
    @IsEmail()
    name: string

    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsNotEmpty()
    @ApiProperty()
    type: ReactionTypes

    @ApiProperty({ type: [Object] })
    @ValidateNested()
    params: ReactionParam[];
}
