import {Body, Controller, Get, Req, Request, UseGuards} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { UsersService } from "./users.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("profile")
  async getUserProfile(@Request() req) {
    return await this.usersService.findByEmail(req.user.email);
  }

  @Get('authorization')
  async getUserAuthorization(@Req() req: Request) {
    return this.usersService.getUserAuthorization(req);
  }
}
