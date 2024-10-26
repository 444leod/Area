import { ReactionTypes } from "../reaction-types.enum";
import { BaseReactionInfos } from "../reaction-infos.class";
import { RegisterReaction } from "../reaction.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

@RegisterReaction(ReactionTypes.COMMENT_YOUTUBE_VIDEO)
export class CommentYoutubeVideoInfos extends BaseReactionInfos {
  type: ReactionTypes.COMMENT_YOUTUBE_VIDEO;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  video_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
