import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Min, IsNumber } from "class-validator";
import { ReactionTypes } from "../reaction-types.enum";
import { BaseReactionInfos } from "../reaction-infos.class";

export class SendArtistsReportByEmailInfos extends BaseReactionInfos {
  type: ReactionTypes.SEND_ARTISTS_REPORT_BY_MAIL;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Number of artists must be at least 1' })
  nb_artists: number;
}
