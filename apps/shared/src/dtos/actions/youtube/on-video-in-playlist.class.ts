import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RegisterAction } from "../action.decorator";

@RegisterAction(ActionTypes.ON_NEW_VIDEO_IN_PLAYLIST)
export class OnNewVideoInPlaylistInfos extends BaseActionInfos {
  type: ActionTypes.ON_NEW_VIDEO_IN_PLAYLIST;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  playlist_id: string;
}
