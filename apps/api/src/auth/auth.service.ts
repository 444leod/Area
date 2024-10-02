import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { UserLoginDto, UserRegistrationDto } from "@area/shared";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(dto: UserLoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user)
      throw new NotFoundException("User not found");

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid)
      throw new UnauthorizedException("Invalid password");

    const payload = { sub: user._id.toHexString(), email: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(dto: UserRegistrationDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user != undefined)
      throw new ConflictException();
    const newUser = await this.usersService.createUser(dto);
    const payload = { sub: newUser._id.toHexString(), email: newUser.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
