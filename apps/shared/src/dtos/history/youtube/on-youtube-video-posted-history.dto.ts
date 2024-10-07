import { ActionTypes } from "../../actions";

export interface OnYoutubeVideoPostedHistoryDTO {
    type: ActionTypes.ON_YOUTUBE_VIDEO_POSTED;
    lastVideoTimestamp: number;
}