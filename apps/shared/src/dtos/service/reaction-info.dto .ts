import { ApiProperty } from "@nestjs/swagger";
import { ReactionTypes } from "../reactions";
import { ServiceParam } from "./service-param.class";
import { AuthorizationsTypes } from "../authorizations";

export class ReactionInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: ReactionTypes;

  @ApiProperty({ type: [AuthorizationsTypes] })
  authorizations?: AuthorizationsTypes[];

  @ApiProperty({ type: [ServiceParam] })
  params: ServiceParam[];
}
