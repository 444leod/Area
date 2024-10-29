import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { RegisterAction } from "../action.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

@RegisterAction(ActionTypes.ON_GOOGLE_TASK_EXPIRED)
export class OnGoogleTaskExpiredInfos extends BaseActionInfos {
  type: ActionTypes.ON_GOOGLE_TASK_EXPIRED;

  @ApiProperty()
  @IsString()
  @IsOptional()
  list_name: string;
}
