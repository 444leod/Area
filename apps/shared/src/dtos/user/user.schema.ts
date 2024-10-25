import { Prop, Schema } from "@nestjs/mongoose";
import { Area } from "../area";
import { ObjectId } from "mongodb";
import { AuthorizationDto } from "./authorization.dto";
import { Role } from "./role.enum";

@Schema({ versionKey: false })
export class User {
  _id: ObjectId;

  @Prop()
  roles: Role[];

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  authorizations: AuthorizationDto[];

  @Prop()
  areas: Area[];
}
