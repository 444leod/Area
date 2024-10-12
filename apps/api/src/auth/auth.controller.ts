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

  @Get("/google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("/google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const loginResponse = await this.authService.handleGoogleCallback(req);

    const token = loginResponse.token;
    return res.redirect(`${process.env.GOOGLE_REDIRECT_URL}?token=${token}`);
  }

  @Post("/register")
  async register(@Body() registerDto: UserRegistrationDto) {
    if (!registerDto) throw new BadRequestException();
    return this.authService.register(registerDto);
  }
}
