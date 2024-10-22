import {Body, Controller, Get, Req, Request, UseGuards} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { UsersService } from "./users.service";
import {ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";
import {UserUnauthorizedOptions, AuthorizationOkOptions, UserNotFoundOptions} from "./swagger-content";
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("profile")
  async getUserProfile(@Request() req) {
    return await this.usersService.findByEmail(req.user.email);
  }

  @ApiBearerAuth("token")
  @ApiResponse(UserUnauthorizedOptions)
  @ApiResponse(AuthorizationOkOptions)
  @ApiResponse(UserNotFoundOptions)
  @Get('authorization')
  async getUserAuthorization(@Req() req: Request) {
    return this.usersService.getUserAuthorization(req);
  }
}
