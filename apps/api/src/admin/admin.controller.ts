import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminDashboardInfos, Role } from "@area/shared";
import { Roles } from "../roles/roles.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../roles/roles.guard";
import { AdminService } from "./admin.service";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AdminDashOkResponse } from "./swagger-content";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @ApiOkResponse(AdminDashOkResponse)
  async getDashboardInformations(): Promise<AdminDashboardInfos> {
    return await this.adminService.getDashboardInfos();
  }
}
