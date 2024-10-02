import { Body, Controller, NotFoundException, Post, Request, UseGuards } from "@nestjs/common";
import { AreasService } from "./areas.service";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { AreaCreationDto } from "@area/shared";
import { UsersService } from "../users/users.service";
import { AreasHelper } from "./areas.helper";

@ApiTags("Areas")
@Controller("/areas")
export class AreasController {
  constructor(
    private readonly areasHelper: AreasHelper,
    private readonly usersService: UsersService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createArea(@Request() req, @Body() dto: AreaCreationDto) {
    const area = this.areasHelper.build(dto);
    this.usersService.addAreaToUser(req.user, area);
    return area;
  }
}
