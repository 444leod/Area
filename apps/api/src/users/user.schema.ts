import { User } from "@area/shared";
import { SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);