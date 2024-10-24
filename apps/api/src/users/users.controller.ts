import { Controller, Delete, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AuthentifiedUser, AuthGuard, AuthRequest } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserUnauthorizedOptions, AuthorizationOkOptions, UserNotFoundOptions } from './swagger-content';
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('ping')
    async getUserProfile(@Request() req: AuthRequest): Promise<AuthentifiedUser> {
        return req.user;
    }

    @ApiBearerAuth('token')
    @ApiResponse(UserUnauthorizedOptions)
    @ApiResponse(AuthorizationOkOptions)
    @ApiResponse(UserNotFoundOptions)
    @Get('authorization')
    async getUserAuthorizations(@Req() req: Request) {
        return this.usersService.getUserAuthorizations(req);
    }

    @UseGuards(AuthGuard)
    @Delete()
    async deleteUser(@Request() req: AuthRequest): Promise<void> {
        return await this.usersService.deleteUser(req.user);
    }
}
