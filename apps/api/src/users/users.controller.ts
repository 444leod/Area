import {
  Controller,
  Delete,
  Get,
  Req,
  Request,
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
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("profile")
  async getUserProfile(@Request() req: AuthRequest) {
    return await this.usersService.findByEmail(req.user.email);
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
  async deleteUser(@Request() req: AuthRequest): Promise<void> {
    return await this.usersService.deleteUser(req.user);
  }
}
