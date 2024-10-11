import { BadRequestException, Body, Controller, HttpCode, Res, HttpStatus, Post, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDto, UserRegistrationDto } from "@area/shared";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("/login")
  async login(@Body() loginDto: UserLoginDto) {
    if (!loginDto)
      throw new BadRequestException();
    return this.authService.login(loginDto);
  }

  @Post('google-callback')
  async googleCallback(@Body('code') code: string) {
    if (!code) {
      throw new BadRequestException('Google authorization code is required');
    }
    return this.authService.handleGoogleCallback(code);
  }

  @Post("/register")
  async register(@Body() registerDto: UserRegistrationDto) {
    if (!registerDto)
      throw new BadRequestException();
    return this.authService.register(registerDto);
  }
}