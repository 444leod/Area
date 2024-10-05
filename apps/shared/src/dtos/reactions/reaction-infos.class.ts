import { IsEnum } from "class-validator";
import { ExampleReactionInfos } from "./example-reaction.class";
import { ReactionTypes } from "./reaction-types.enum";
import { SendEmailReactionInfos } from "./send-email.dto";

export class BaseReactionInfos {
    @IsEnum(ReactionTypes)
    type: ReactionTypes
}

export type ReactionInfos = ExampleReactionInfos | SendEmailReactionInfos;