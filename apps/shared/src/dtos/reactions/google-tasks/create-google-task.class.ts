import { IsNotEmpty, IsString } from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ApiProperty } from "@nestjs/swagger";
import { ReactionTypes } from "../reaction-types.enum";
import { RegisterReaction } from "../reaction.decorator";

@RegisterReaction(ReactionTypes.CREATE_GOOGLE_TASK)
export class CreateGoogleTaskInfos extends BaseReactionInfos {
  type: ReactionTypes.CREATE_GOOGLE_TASK;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;
}
