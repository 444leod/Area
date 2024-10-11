import { IsEnum } from "class-validator";
import { ExampleReactionInfos } from "./example-reaction.class";
import { SendEmailReactionInfos } from "./emails/send-email.dto";
import { CreateGoogleTaskInfos } from "./google-tasks/create-google-task.class";
import { ReactionTypes } from "./reaction-types.enum";

export class BaseReactionInfos {
  @IsEnum(ReactionTypes)
  type: ReactionTypes;
}

export type ReactionInfos =
  | ExampleReactionInfos
  | SendEmailReactionInfos
  | CreateGoogleTaskInfos;
