import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Res,
  HttpStatus,
  Post,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDto, UserRegistrationDto } from "@area/shared";
import { ApiTags } from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";

@ApiTags("Auth")
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("/login")
  async login(@Body() loginDto: UserLoginDto) {
    if (!loginDto) throw new BadRequestException();
    return this.authService.login(loginDto);
  }

  @Post("/google")
  async googleCallback(@Body("code") code: string) {
    if (!code) {
      throw new BadRequestException("Google authorization code is required");
    }
    return this.authService.handleGoogleCallback(code);
  }

  @Post("/google/mobile")
  async googleMobileAuth(@Body("token") token: string, @Body("isMobile") isMobile: boolean, @Body("refreshToken") refreshToken: string) {
    if (!token) {
      throw new BadRequestException("Google token is required");
    }
    return this.authService.handleGoogleMobileAuth(token, refreshToken, isMobile);
  }

  @Post("/register")
  async register(@Body() registerDto: UserRegistrationDto) {
    if (!registerDto) throw new BadRequestException();
    return this.authService.register(registerDto);
  }
}
