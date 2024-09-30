import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('profile')
    getUserProfile(@Request() req) {
        return this.usersService.findByEmail(req.user.email);
    }
}
