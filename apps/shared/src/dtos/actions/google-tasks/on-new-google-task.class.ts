import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { RegisterAction } from "../action.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

@RegisterAction(ActionTypes.ON_NEW_GOOGLE_TASK)
export class OnNewGoogleTaskInfos extends BaseActionInfos {
  type: ActionTypes.ON_NEW_GOOGLE_TASK;

  @ApiProperty()
  @IsString()
  @IsOptional()
  list_name: string;
}
