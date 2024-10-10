import { ApiProperty } from "@nestjs/swagger";
import {
  ActionInfos,
  ActionTypes,
  BaseActionInfos,
  EachXSecondsActionInfos,
  ExampleActionInfos,
  OnYoutubeVideoPostedClass,
} from "../actions";
import {
  BaseReactionInfos,
  CreateGoogleTaskInfos,
  ExampleReactionInfos,
  ReactionInfos,
  ReactionTypes,
  SendEmailReactionInfos, SendMessageToDiscordWebhookInfos,
} from "../reactions";
import { IsNotEmptyObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AreaCreationDto {
  @ApiProperty()
  @IsNotEmptyObject()

  /* This basically tells the Pipeline to validate sub-objects
   ** with a specific type if a property meets a certain value */
  @ValidateNested()
  @Type(() => BaseActionInfos, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        { value: ExampleActionInfos, name: ActionTypes.EXAMPLE_ACTION },
        { value: EachXSecondsActionInfos, name: ActionTypes.EACH_X_SECONDS },
        { value: OnYoutubeVideoPostedClass, name: ActionTypes.ON_YOUTUBE_VIDEO_POSTED },
      ],
    },
  })
  action: ActionInfos;

  @ApiProperty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseReactionInfos, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        { value: ExampleReactionInfos, name: ReactionTypes.EXAMPLE_REACTION },
        { value: SendEmailReactionInfos, name: ReactionTypes.SEND_EMAIL },
        { value: CreateGoogleTaskInfos, name: ReactionTypes.CREATE_GOOGLE_TASK },
        { value: SendMessageToDiscordWebhookInfos, name: ReactionTypes.SEND_MESSAGE_TO_DISCORD_WEBHOOK },
      ],
    },
  })
  reaction: ReactionInfos;
}
