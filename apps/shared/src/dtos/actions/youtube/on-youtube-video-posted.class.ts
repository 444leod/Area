import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { IsNotEmpty, IsString } from "class-validator";

export class OnYoutubeVideoPostedClass extends BaseActionInfos {
  type: ActionTypes.ON_YOUTUBE_VIDEO_POSTED;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
