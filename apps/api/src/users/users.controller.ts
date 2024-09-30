import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
    @UseGuards(AuthGuard)
    @Get('profile')
    getUserProfile(@Request() req) {
        return {
            user: req.user
        }
    }
}
