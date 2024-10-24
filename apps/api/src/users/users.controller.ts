import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard, AuthRequest } from "../auth/auth.guard";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";
import {
  UserUnauthorizedOptions,
  ProfileOkOptions,
  AuthorizationsOkOptions,
} from "./swagger-content";
import { User } from "@area/shared";
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("profile")
  @ApiResponse(ProfileOkOptions)
  @ApiResponse(UserUnauthorizedOptions)
  async getUserProfile(@Request() req: AuthRequest): Promise<User> {
    const user = await this.usersService.findById(req.user.id);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @ApiResponse(AuthorizationsOkOptions)
  @ApiResponse(UserUnauthorizedOptions)
  @Get("authorizations")
  async getUserAuthorizations(@Request() req: AuthRequest) {
    return this.usersService.getUserAuthorizations(req.user);
  }

  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "User deleted successfuly. No content sent.",
  })
  @ApiResponse(UserUnauthorizedOptions)
  async deleteUser(@Request() req: AuthRequest): Promise<void> {
    await this.usersService.deleteUser(req.user);
  }
}
