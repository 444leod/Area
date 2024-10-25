import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ReactionTypes } from "../reaction-types.enum";
import { BaseReactionInfos } from "../reaction-infos.class";
import { IsEmailOrVariable } from "../../../validators/";
import { RegisterReaction } from "../reaction.decorator";

@RegisterReaction(ReactionTypes.SEND_EMAIL)
export class SendEmailReactionInfos extends BaseReactionInfos {
  type: ReactionTypes.SEND_EMAIL;

  @ApiProperty()
  @IsEmailOrVariable()
  to: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;
}
