import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ReactionTypes } from "../reaction-types.enum";
import { BaseReactionInfos } from "../reaction-infos.class";
import { IsEmailOrVariable, IsNumberOrVariable } from "../../../validators/";

export class SendAlbumsReportByEmailInfos extends BaseReactionInfos {
  type: ReactionTypes.SEND_ALBUMS_REPORT_BY_MAIL;

  @ApiProperty()
  @IsEmailOrVariable()
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
  @IsNumberOrVariable(1)
  nb_albums: number | string;
}
