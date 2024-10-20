import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  ActionInfos,
  ActionTypes,
  BaseActionInfos,
  EachXSecondsActionInfos,
  ExampleActionInfos,
  OnNewJiraTicketClass,
  OnYoutubeVideoPostedClass, OnNewGithubRepositoryClass,
} from "../actions";
import {
  BaseReactionInfos,
  CreateGoogleTaskInfos,
  ExampleReactionInfos,
  ReactionInfos,
  ReactionTypes,
  SendEmailReactionInfos, SendMessageToDiscordWebhookInfos,
} from "../reactions";
import { IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@ApiExtraModels(ExampleActionInfos, EachXSecondsActionInfos, OnYoutubeVideoPostedClass, OnNewJiraTicketClass, OnNewJiraTicketClass, OnNewGithubRepositoryClass)
@ApiExtraModels(ExampleReactionInfos, SendEmailReactionInfos, CreateGoogleTaskInfos, SendMessageToDiscordWebhookInfos)
export class AreaCreationDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ExampleActionInfos) },
      { $ref: getSchemaPath(EachXSecondsActionInfos) },
      { $ref: getSchemaPath(OnYoutubeVideoPostedClass) },
      { $ref: getSchemaPath(OnNewJiraTicketClass) },
      { $ref: getSchemaPath(OnNewJiraTicketClass) },
      { $ref: getSchemaPath(OnNewGithubRepositoryClass) },
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
        { value: OnYoutubeVideoPostedClass, name: ActionTypes.ON_YOUTUBE_VIDEO_POSTED },
        { value: OnNewJiraTicketClass, name: ActionTypes.ON_NEW_JIRA_TICKET },
        { value: OnNewJiraTicketClass, name: ActionTypes.ON_NEW_JIRA_PROJECT },
        { value: OnNewGithubRepositoryClass, name: ActionTypes.ON_NEW_GITHUB_REPOSITORY },
      ],
    },
  })
  action: ActionInfos;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ExampleReactionInfos) },
      { $ref: getSchemaPath(SendEmailReactionInfos) },
      { $ref: getSchemaPath(CreateGoogleTaskInfos) },
      { $ref: getSchemaPath(SendMessageToDiscordWebhookInfos) }
    ],
  })
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
