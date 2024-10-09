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
    token: string;
    service_Id: ObjectId;
  }): Promise<User> {
    let user = await this.userModel.findOne({ email: userData.email });
    if (user) {
      const authIndex = user.user_authorization.findIndex(
        (auth) =>
          auth.service_Id.equals(userData.service_Id) && auth.type === "GOOGLE",
      );
      if (authIndex !== -1) {
        user.user_authorization[authIndex].data = userData.token;
      } else {
        user.user_authorization.push({
          service_Id: userData.service_Id,
          type: "GOOGLE",
          data: userData.token,
        });
      }
      return await user.save();
    }

    const newUser = new this.userModel({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      user_authorization: [
        {
          service_Id: userData.service_Id,
          type: "GOOGLE",
          data: userData.token,
        },
      ],
    });
    return await newUser.save();
  }

  async findById(id: string | ObjectId): Promise<User | undefined> {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email: email }).exec();
  }
}
