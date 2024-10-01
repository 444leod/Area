import { Prop, Schema } from "@nestjs/mongoose";
import { AreaDTO } from "./area.dto";
import { ObjectId } from "mongodb";

@Schema({versionKey: false})
export class User {
  _id: ObjectId;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  areas: AreaDTO[];
}
