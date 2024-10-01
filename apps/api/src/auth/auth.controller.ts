import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDto, UserRegistrationDto } from "@area/shared";
import { ApiTags } from "@nestjs/swagger";

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

  @Post("/register")
  async register(@Body() registerDto: UserRegistrationDto) {
    if (!registerDto)
      throw new BadRequestException();
    return this.authService.register(registerDto);
  }
}
