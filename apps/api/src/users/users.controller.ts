import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard, AuthRequest } from "../auth/auth.guard";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";
import {
  UserUnauthorizedOptions,
  AuthorizationOkOptions,
  UserNotFoundOptions,
} from "./swagger-content";
import { User } from "@area/shared";
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("profile")
  async getUserProfile(@Request() req: AuthRequest): Promise<User> {
    const user = await this.usersService.findById(req.user.id);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @ApiBearerAuth("token")
  @ApiResponse(UserUnauthorizedOptions)
  @ApiResponse(AuthorizationOkOptions)
  @ApiResponse(UserNotFoundOptions)
  @Get("authorization")
  async getUserAuthorizations(@Req() req: Request) {
    return this.usersService.getUserAuthorizations(req);
  }

  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(204)
  async deleteUser(@Request() req: AuthRequest): Promise<void> {
    await this.usersService.deleteUser(req.user);
  }
}
