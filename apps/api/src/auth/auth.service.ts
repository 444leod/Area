import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { UserLoginDto, UserRegistrationDto } from "@area/shared";
import { JwtService } from "@nestjs/jwt";
import { ObjectId } from "mongodb";

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

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from Google';
    }
    const googleServiceId = new ObjectId('64ff2e8e2a6e4b3f78abcd12');
  
    const user = await this.usersService.findOrCreateUser({
      email: req.user.email,
      first_name: req.user.firstName,
      last_name: req.user.lastName,
      token: req.user.accessToken,
      service_id: googleServiceId
    });
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
