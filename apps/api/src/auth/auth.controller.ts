import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Get, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDto, UserRegistrationDto } from "@area/shared";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from '@nestjs/passport';

@ApiTags("Auth")
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK) // instead of "successfully created"
  @Post("/login")
  async login(@Body() loginDto: UserLoginDto) {
    if (!loginDto)
      throw new BadRequestException();
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }


  @Post("/register")
  async register(@Body() registerDto: UserRegistrationDto) {
    if (!registerDto)
      throw new BadRequestException();
    return this.authService.register(registerDto);
  }
}
