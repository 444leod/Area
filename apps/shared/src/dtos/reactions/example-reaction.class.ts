import { IsNotEmpty, IsString } from "class-validator";
import { BaseReactionInfos } from "./reaction-infos.class";
import { ReactionTypes } from "./reaction-types.enum";

export class ExampleReactionInfos extends BaseReactionInfos {
  type: ReactionTypes.EXAMPLE_REACTION;

  @IsString()
  @IsNotEmpty()
  exampleField: string;
}
