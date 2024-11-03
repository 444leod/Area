import { AdminDashboardInfos } from "@area/shared";
import { Injectable } from "@nestjs/common";
import { AreasService } from "../areas/areas.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly areasService: AreasService,
  ) {}

  async getDashboardInfos(): Promise<AdminDashboardInfos> {
    const user_count = await this.usersService.countUsers();
    const { all, active } = await this.areasService.getAreasCounts();
    const { actions, reactions } = await this.areasService.getAreaTypesCount();

    return {
      user_count: user_count,
      areas_count: all,
      active_areas_count: active,
      popular_actions: actions,
      popular_reactions: reactions,
    };
  }
}
