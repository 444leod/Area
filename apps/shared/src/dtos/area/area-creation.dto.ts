import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  ActionInfos,
  ActionTypes,
  BaseActionInfos,
  EachXSecondsActionInfos,
  ExampleActionInfos,
  OnNewJiraTicketClass,
  OnYoutubeVideoPostedClass,
  OnNewGithubRepositoryClass,
  OnPullRequestStateClass,
} from "../actions";
import {
  BaseReactionInfos,
  CreateGoogleTaskInfos,
  ExampleReactionInfos,
  ReactionInfos,
  ReactionTypes,
  SendEmailReactionInfos,
  SendMessageToDiscordWebhookInfos,
} from "../reactions";
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ActionRegistry } from "../actions/action.decorator";

@ApiExtraModels(
  ExampleActionInfos,
  EachXSecondsActionInfos,
  OnYoutubeVideoPostedClass,
  OnNewJiraTicketClass,
  OnNewJiraTicketClass,
  OnNewGithubRepositoryClass,
  OnPullRequestStateClass,
)
@ApiExtraModels(
  ExampleReactionInfos,
  SendEmailReactionInfos,
  CreateGoogleTaskInfos,
  SendMessageToDiscordWebhookInfos,
)
export class AreaCreationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ExampleActionInfos) },
      { $ref: getSchemaPath(EachXSecondsActionInfos) },
      { $ref: getSchemaPath(OnYoutubeVideoPostedClass) },
      { $ref: getSchemaPath(OnNewJiraTicketClass) },
      { $ref: getSchemaPath(OnNewJiraTicketClass) },
      { $ref: getSchemaPath(OnNewGithubRepositoryClass) },
      { $ref: getSchemaPath(OnPullRequestStateClass) },
    ],
  })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseActionInfos, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: ActionRegistry.sub_types
    },
  })
  action: ActionInfos;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ExampleReactionInfos) },
      { $ref: getSchemaPath(SendEmailReactionInfos) },
      { $ref: getSchemaPath(CreateGoogleTaskInfos) },
      { $ref: getSchemaPath(SendMessageToDiscordWebhookInfos) },
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
        {
          value: CreateGoogleTaskInfos,
          name: ReactionTypes.CREATE_GOOGLE_TASK,
        },
        {
          value: SendMessageToDiscordWebhookInfos,
          name: ReactionTypes.SEND_MESSAGE_TO_DISCORD_WEBHOOK,
        },
      ],
    },
  })
  reaction: ReactionInfos;
}
