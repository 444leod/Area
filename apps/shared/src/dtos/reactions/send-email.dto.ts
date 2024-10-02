import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ReactionTypes } from "./reaction-types.enum";
import { BaseReactionInfos } from "./reaction-infos.class";

export class SendEmailReactionInfos extends BaseReactionInfos {
  type: ReactionTypes.SEND_EMAIL;

  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  body?: string;
}
