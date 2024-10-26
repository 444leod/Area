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
  CreateJiraTicketInfos,
  ExampleReactionInfos,
  ReactionInfos,
  ReactionTypes,
  SendEmailReactionInfos,
  SendMessageToDiscordWebhookInfos,
  SendScrobbleReportByEmailInfos,
  SendAlbumsReportByEmailInfos,
  SendArtistsReportByEmailInfos,
} from "../reactions";
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ActionRegistry } from "../actions/action.decorator";
import { ReactionRegistry } from "../reactions/reaction.decorator";

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
  SendScrobbleReportByEmailInfos,
  SendAlbumsReportByEmailInfos,
  SendArtistsReportByEmailInfos,
  CreateJiraTicketInfos,
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
      subTypes: ActionRegistry.sub_types,
    },
  })
  action: ActionInfos;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ExampleReactionInfos) },
      { $ref: getSchemaPath(SendEmailReactionInfos) },
      { $ref: getSchemaPath(CreateGoogleTaskInfos) },
      { $ref: getSchemaPath(SendMessageToDiscordWebhookInfos) },
      { $ref: getSchemaPath(SendScrobbleReportByEmailInfos) },
      { $ref: getSchemaPath(SendAlbumsReportByEmailInfos) },
      { $ref: getSchemaPath(SendArtistsReportByEmailInfos) },
      { $ref: getSchemaPath(CreateJiraTicketInfos) },
    ],
  })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseReactionInfos, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: "type",
      subTypes: ReactionRegistry.sub_types,
    },
  })
  reaction: ReactionInfos;
}
