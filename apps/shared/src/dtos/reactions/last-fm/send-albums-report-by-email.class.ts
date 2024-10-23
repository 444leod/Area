import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { ReactionTypes } from "../reaction-types.enum";
import { BaseReactionInfos } from "../reaction-infos.class";

export class SendAlbumsReportByEmailInfos extends BaseReactionInfos {
  type: ReactionTypes.SEND_ALBUMS_REPORT_BY_MAIL;

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
  @Min(1, { message: 'Number of albums must be at least 1' })
  nb_albums: number;
}
