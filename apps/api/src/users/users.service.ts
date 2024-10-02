import { Area, User, UserRegistrationDto } from "@area/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(dto: UserRegistrationDto): Promise<User> {
    dto.password = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel(dto);
    return await user.save();
  }

  async findOrCreateUser(userData: { email: string; first_name: string; last_name: string }): Promise<User> {
    let user = await this.findByEmail(userData.email);
    if (!user) {
      const newUser = new this.userModel(userData);
      return await newUser.save();
    }
    return user;
  }

  async findById(id: string | ObjectId) : Promise<User | undefined> {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async addAreaToUser(user: {sub: string}, area: Area) : Promise<User> {
    const u = await this.userModel.findById(user.sub);
    u.areas.push(area);
    return await u.save();
  }

  async removeAreaFromUser(user: {sub: string}, id: string) : Promise<User> {
    const u = await this.userModel.findById(user.sub);
    if (!u.areas.find(a => a._id.toHexString() === id))
      throw new NotFoundException("AREA not found");
    u.areas = u.areas.filter(a => a._id.toHexString() !== id);
    return await u.save();
  }
}
