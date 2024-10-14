import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ReactionTypes } from "../reactions";
  
export class ReactionCreationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsNotEmpty()
    @ApiProperty()
    ActionType: string

    @ApiProperty({ type: [Object], default: [] })
    params: { name: string; type: 'string' | 'number'; ActionType: ReactionTypes }[];
}


export class ReactionInfo {
    @ApiProperty()
    @IsEmail()
    name: string

    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsNotEmpty()
    @ApiProperty()
    ActionType: string

    @ApiProperty({ type: [Object] })
    params: { name: string; type: 'string' | 'number'; ActionType: ReactionTypes }[];
}