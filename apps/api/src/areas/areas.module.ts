import { Module } from "@nestjs/common";
import { AreasController } from "./areas.controller";
import { AreasService } from "./areas.service";
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
  exports: [AreasService],
})
export class AreasModule {}
