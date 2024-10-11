import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
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
  SendEmailReactionInfos,
} from "../reactions";
import { IsNotEmptyObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@ApiExtraModels(ExampleActionInfos, EachXSecondsActionInfos, OnYoutubeVideoPostedClass)
@ApiExtraModels(ExampleReactionInfos, SendEmailReactionInfos, CreateGoogleTaskInfos)
export class AreaCreationDto {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ExampleActionInfos) },
      { $ref: getSchemaPath(EachXSecondsActionInfos) },
      { $ref: getSchemaPath(OnYoutubeVideoPostedClass) },
    ],
  })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseActionInfos, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: [
        { value: ExampleActionInfos, name: ActionTypes.EXAMPLE_ACTION },
        { value: EachXSecondsActionInfos, name: ActionTypes.EACH_X_SECONDS },
        {
          value: OnYoutubeVideoPostedClass,
          name: ActionTypes.ON_YOUTUBE_VIDEO_POSTED,
        },
      ],
    },
  })
  action: ActionInfos;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ExampleReactionInfos) },
      { $ref: getSchemaPath(SendEmailReactionInfos) },
      { $ref: getSchemaPath(CreateGoogleTaskInfos) },
    ],
  })
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
        {
          value: CreateGoogleTaskInfos,
          name: ReactionTypes.CREATE_GOOGLE_TASK,
        },
      ],
    },
  })
  reaction: ReactionInfos;
}
