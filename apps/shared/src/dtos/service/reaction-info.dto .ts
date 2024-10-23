import { ApiProperty } from "@nestjs/swagger";
import { ReactionTypes } from "../reactions";
import { ReactionParam } from "./reaction-param.class";

export class ReactionInfo {
    @ApiProperty()
    name: string

    @ApiProperty()
    description: string

    @ApiProperty()
    type: ReactionTypes

    @ApiProperty({ type: [Object] })
    params: ReactionParam[];
}
