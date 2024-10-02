import { User, UserRegistrationDto } from "@area/shared";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(dto: UserRegistrationDto) : Promise<User> {
    dto.password = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel(dto);
    return user.save();
  }

  async findOrCreateUser(userData: { email: string; first_name: string; last_name: string }): Promise<User> {
    let user = await this.findByEmail(userData.email);
    if (!user) {
      const newUser = new this.userModel(userData);
      return await newUser.save();
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email }).exec();
  }
}
