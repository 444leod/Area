import { Module } from "@nestjs/common";
import { AreasController } from "./areas.controller";
import { AreasService } from "./areas.service";
import { UsersModule } from "../users/users.module";
import { AreasHelper } from "./areas.helper";
import { MongooseModule } from "@nestjs/mongoose";
import { User } from "@area/shared";
import { UserSchema } from "src/users/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AreasController],
  providers: [AreasService, AreasHelper],
})
export class AreasModule {}
