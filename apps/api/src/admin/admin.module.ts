import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AreasModule } from "src/areas/areas.module";
import { UsersModule } from "src/users/users.module";
import { AdminService } from "./admin.service";

@Module({
  imports: [AreasModule, UsersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
