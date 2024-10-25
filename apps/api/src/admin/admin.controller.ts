import { Controller, Get, UseGuards } from "@nestjs/common";
import { Role } from "@area/shared";
import { Roles } from "src/roles/roles.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";

@Controller("admin")
export class AdminController {
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    async getDashboardInformations(): Promise<string> {
        return "Hello ADMIN user! 👋";
    }
}
