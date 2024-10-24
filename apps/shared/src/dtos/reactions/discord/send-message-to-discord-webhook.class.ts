import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ReactionTypes } from "../reaction-types.enum";

export class SendMessageToDiscordWebhookInfos extends BaseReactionInfos {
  type: ReactionTypes.SEND_MESSAGE_TO_DISCORD_WEBHOOK;

  @IsString()
  @IsNotEmpty()
  webhook_url: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  //
  // @ValidateIf((obj) => obj.date !== undefined)
  // @IsDateOrMatchesRegex(/{{(.*?)}}/g, { message: 'Must be a valid date or be a {{variable}}' })
  // date?: string;
}
