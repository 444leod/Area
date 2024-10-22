import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Min } from "class-validator";
import { ReactionTypes } from "../reaction-types.enum";
import { BaseReactionInfos } from "../reaction-infos.class";

export class SendScrobbleReportByEmailInfos extends BaseReactionInfos {
  type: ReactionTypes.SEND_SCROBBLE_REPORT_BY_MAIL;

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
  @Min(1, { message: 'Number of tracks must be at least 1' })
  nb_tracks: number;
}
