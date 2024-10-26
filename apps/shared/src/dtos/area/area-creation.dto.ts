import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  ActionInfos,
  BaseActionInfos,
  EachXSecondsActionInfos,
  ExampleActionInfos,
  OnNewJiraTicketInfos,
  OnYoutubeVideoPostedInfos,
  OnNewGithubRepositoryInfos,
  OnPullRequestStateInfos,
} from "../actions";
import {
  BaseReactionInfos,
  CreateGoogleTaskInfos,
  CreateJiraTicketInfos,
  ExampleReactionInfos,
  ReactionInfos,
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
import { ReactionRegistry } from "../reactions";

@ApiExtraModels(
  ExampleActionInfos,
  EachXSecondsActionInfos,
  OnYoutubeVideoPostedInfos,
  OnNewJiraTicketInfos,
  OnNewJiraTicketInfos,
  OnNewGithubRepositoryInfos,
  OnPullRequestStateInfos,
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
      { $ref: getSchemaPath(OnYoutubeVideoPostedInfos) },
      { $ref: getSchemaPath(OnNewJiraTicketInfos) },
      { $ref: getSchemaPath(OnNewJiraTicketInfos) },
      { $ref: getSchemaPath(OnNewGithubRepositoryInfos) },
      { $ref: getSchemaPath(OnPullRequestStateInfos) },
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
