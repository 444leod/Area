import { AdminDashboardInfos, User } from '@area/shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async getDashboardInfos(): Promise<AdminDashboardInfos> {
    const user_count = await this.userModel.countDocuments().exec();
    return {
      user_count: user_count
    };
  }
}
