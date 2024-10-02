import { Area, User, UserRegistrationDto } from "@area/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(dto: UserRegistrationDto): Promise<User> {
    dto.password = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel(dto);
    return await user.save();
  }

  async findOrCreateUser(userData: {
    email: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    let user = await this.findByEmail(userData.email);
    if (!user) {
      const newUser = new this.userModel(userData);
      return await newUser.save();
    }
    return user;
  }

  async findById(id: string | ObjectId): Promise<User | undefined> {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  /** AREA RELATER */

  async getUserArea(user: { sub: string }, id: ObjectId) : Promise<Area> {
    const u = await this.userModel.findById(user.sub);
    const area = u.areas.find(a => a._id.equals(id));
    if (!area) throw new NotFoundException("Area Not Found.");
    return area;
  }

  async addAreaToUser(user: { sub: string }, area: Area): Promise<User> {
    const u = await this.userModel.findById(user.sub);
    u.areas.push(area);
    return await u.save();
  }

  async removeAreaFromUser(user: { sub: string }, id: ObjectId): Promise<User> {
    const u = await this.userModel.findById(user.sub);
    if (!u.areas.find((a) => a._id.equals(id)))
      throw new NotFoundException("Area Not Found.");
    u.areas = u.areas.filter((a) => !a._id.equals(id));
    return await u.save();
  }

  async updateUserArea(user: { sub: string }, area: Area): Promise<Area> {
    const u = await this.userModel.findById(user.sub);
    const index = u.areas.findIndex(a => a._id.equals(area._id));
    if (index < 0)
      throw new NotFoundException("AREA not found");
    u.areas[index] = area;
    u.save();
    return u.areas[index];
  }

  async toggleUserArea(user: { sub: string }, id: ObjectId): Promise<Area> {
    const area = await this.getUserArea(user, id);
    area.active = !area.active;
    return await this.updateUserArea(user, area);
  }
}
