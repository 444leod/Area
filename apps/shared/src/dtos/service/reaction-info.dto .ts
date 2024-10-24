import { ApiProperty } from "@nestjs/swagger";
import { ReactionTypes } from "../reactions";
import { ServiceParam } from "./service-param.class";

export class ReactionInfo {
    @ApiProperty()
    name: string

    @ApiProperty()
    description: string

    @ApiProperty()
    type: ReactionTypes

    @ApiProperty({ type: [ServiceParam] })
    params: ServiceParam[];
}
