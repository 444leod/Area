import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ReactionTypes } from '../reaction-types.enum';
import { BaseReactionInfos } from '../reaction-infos.class';

export class SendEmailReactionInfos extends BaseReactionInfos {
  type: ReactionTypes.SEND_EMAIL;

  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
