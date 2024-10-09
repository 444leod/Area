import { Action, ActionTypes, OnYoutubeVideoPostedClass } from "@area/shared";
import { ActionBuilder } from "./action.builder";

export class OnYoutubeVideoPostedBuilder implements ActionBuilder {
  build(dto: OnYoutubeVideoPostedClass): Action {
    return {
      isWebhook: false,
      service_id: undefined,
      informations: dto,
      history: {
        type: ActionTypes.ON_YOUTUBE_VIDEO_POSTED,
        lastVideoTimestamp: 0,
      },
    };
  }
}
