import { IsEnum } from "class-validator";
import { ExampleReactionInfos } from "./example-reaction.class";
import { SendEmailReactionInfos } from "./emails/send-email.dto";
import { CreateGoogleTaskInfos } from "./google-tasks/create-google-task.class";
import { ReactionTypes } from "./reaction-types.enum";
import { ApiProperty } from "@nestjs/swagger";
import { SendMessageToDiscordWebhookInfos } from "./discord/send-message-to-discord-webhook.class";
import { SendScrobbleReportByEmailInfos } from "./last-fm/send-scrobble-report-by-email.class";
import { SendAlbumsReportByEmailInfos } from "./last-fm/send-albums-report-by-email.class";
import { SendArtistsReportByEmailInfos } from "./last-fm/send-artists-report-by-email.class";
import { CreatePullRequestCommentClass } from "./github/create-pull-request-comment.class";

export class BaseReactionInfos {
  @ApiProperty()
  @IsEnum(ReactionTypes)
  type: ReactionTypes;
}

export type ReactionInfos =
  | ExampleReactionInfos
  | SendEmailReactionInfos
  | CreateGoogleTaskInfos
  | SendMessageToDiscordWebhookInfos
  | CreatePullRequestCommentClass
  | SendScrobbleReportByEmailInfos
  | SendAlbumsReportByEmailInfos
  | SendArtistsReportByEmailInfos;
