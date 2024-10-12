import { ActionTypes } from "../action-types.enum";
import {BaseActionInfos} from "../action-infos.class";
import {IsNotEmpty, IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OnYoutubeVideoPostedClass extends BaseActionInfos {
    type: ActionTypes.ON_YOUTUBE_VIDEO_POSTED;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    user_id: string;
}