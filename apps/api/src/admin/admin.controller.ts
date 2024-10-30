import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminDashboardInfos, Role } from "@area/shared";
import { Roles } from "src/roles/roles.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {

    constructor (private readonly adminService: AdminService) {}

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    async getDashboardInformations(): Promise<AdminDashboardInfos> {
        return await this.adminService.getDashboardInfos();
    }
}
