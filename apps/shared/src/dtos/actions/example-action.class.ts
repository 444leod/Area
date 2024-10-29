import { IsNotEmpty, IsString } from "class-validator";
import { ActionTypes } from "./action-types.enum";
import { BaseActionInfos } from "./action-infos.class";
import { ApiProperty } from "@nestjs/swagger";
import { RegisterAction } from "./action.decorator";

@RegisterAction(ActionTypes.EXAMPLE_ACTION)
export class ExampleActionInfos extends BaseActionInfos {
  type: ActionTypes.EXAMPLE_ACTION;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  exampleField: string;
}
