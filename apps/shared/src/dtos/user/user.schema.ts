import { Prop, Schema } from "@nestjs/mongoose";
import { Area } from "../area";
import { ObjectId } from "mongodb";
import { AuthorizationDto } from "./authorization.dto"

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
  user_authorization: AuthorizationDto[];

  @Prop()
  areas: Area[];
}
