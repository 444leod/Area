import { IsEnum } from "class-validator";
import { ActionTypes } from "./action-types.enum";
import { ExampleActionInfos } from "./example-action.class";
import {EachXSecondsActionInfos} from "./timer/each-x-seconds.class";
import {OnYoutubeVideoPostedClass} from "./youtube/on-youtube-video-posted.class";

export class BaseActionInfos {
    @IsEnum(ActionTypes)
    type: ActionTypes
}

export type ActionInfos = ExampleActionInfos | EachXSecondsActionInfos | OnYoutubeVideoPostedClass;
