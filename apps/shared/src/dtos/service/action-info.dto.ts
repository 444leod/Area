import { ApiProperty } from "@nestjs/swagger";
import { ActionTypes } from "../actions";
import { ServiceParam } from "./service-param.class";
import { ActionVariable } from "./action-variable.class";

export class ActionInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: ActionTypes;

  @ApiProperty({ type: [ServiceParam] })
  params: ServiceParam[];

  @ApiProperty({ type: [ActionVariable] })
  variables?: ActionVariable[];
}
