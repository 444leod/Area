import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
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
    if (!loginDto) throw new BadRequestException();
    return this.authService.login(loginDto);
  }

  @Post("/atlassian")
  async atlassianconnection(@Body("code") code: string, @Req() req: Request) {
    if (!code) {
      throw new BadRequestException("Atlassian authorization code is required");
    }

    return this.authService.connectAtlassian(code, req);
  }

  @Post("/github")
  async githubconnection(@Body("code") code: string, @Req() req: Request) {
    if (!code) {
      throw new BadRequestException("GitHub authorization code is required");
    }

    return this.authService.connectGithub(code, req);
  }

  @Post("/spotify")
  async spotifyconnection(@Body("code") code: string, @Req() req: Request) {
    if (!code) {
      throw new BadRequestException("Spotify authorization code is required");
    }

    return this.authService.connectSpotify(code, req);
  }

  @Post("/simpleAuthGoogle")
  async googleconnection(@Body("code") code: string, @Req() req: Request) {
    if (!code) {
      throw new BadRequestException("Google authorization code is required");
    }

    return this.authService.connectGoogle(code, req);
  }

  @Post("/google")
  async googleCallback(@Body("code") code: string) {
    if (!code) {
      throw new BadRequestException("Google authorization code is required");
    }
    return this.authService.handleGoogleCallback(code);
  }

  @Post("/google/mobile")
  async googleMobileAuth(
    @Body("token") token: string,
    @Body("isMobile") isMobile: boolean,
    @Body("refreshToken") refreshToken: string,
    @Body("expired_at") expired_at: Date,
  ) {
    if (!token) {
      throw new BadRequestException("Google token is required");
    }
    return this.authService.handleGoogleMobileAuth(
      token,
      refreshToken,
      isMobile,
      expired_at,
    );
  }

  @Post("/register")
  async register(@Body() registerDto: UserRegistrationDto) {
    if (!registerDto) throw new BadRequestException();
    return this.authService.register(registerDto);
  }
}
