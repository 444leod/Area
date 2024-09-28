import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { User } from "@area/shared";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() loginDto: User) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Post("/register")
  async register(@Body() loginDto: User) {
    const { email, password } = loginDto;
    const result = await this.authService.register(email, password);

    return result;
  }
}
