import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RegisterAction } from "../action.decorator";

@RegisterAction(ActionTypes.EACH_X_SECONDS)
export class EachXSecondsActionInfos extends BaseActionInfos {
  type: ActionTypes.EACH_X_SECONDS;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  seconds: number;
}
