import { Prop, Schema } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { ActionInfo } from "./action-info.dto";
import { ReactionInfo } from "./reaction-info.dto ";

@Schema({ versionKey: false })
export class Service {
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [ActionInfo] })
  actions: ActionInfo[];

  @Prop({ type: [ReactionInfo] })
  reactions: ReactionInfo[];
}
