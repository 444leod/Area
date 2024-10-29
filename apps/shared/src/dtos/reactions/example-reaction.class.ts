import { IsNotEmpty, IsString } from "class-validator";
import { BaseReactionInfos } from "./reaction-infos.class";
import { ReactionTypes } from "./reaction-types.enum";
import { ApiProperty } from "@nestjs/swagger";
import { RegisterReaction } from "./reaction.decorator";

@RegisterReaction(ReactionTypes.EXAMPLE_REACTION)
export class ExampleReactionInfos extends BaseReactionInfos {
  type: ReactionTypes.EXAMPLE_REACTION;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  exampleField: string;
}
