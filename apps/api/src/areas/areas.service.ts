import { Area, User, AuthorizationDto } from "@area/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { AuthentifiedUser } from "src/auth/auth.guard";

@Injectable()
export class AreasService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async findCurrentUser(user: AuthentifiedUser): Promise<(Document<unknown, unknown, User> & User)> {
    const u = await this.userModel.findById(user.id);
    if (!u)
      throw new NotFoundException("User not found");
    return u;
  }

  async getWebhookReaById(
    id: ObjectId,
  ): Promise<{ uid: ObjectId; auths: AuthorizationDto[]; area: Area }> {
    const user = await this.userModel
      .findOne({ "areas._id": id }, { _id: 1, authorizations: 1, "areas.$": 1 })
      .exec();
    if (!user || user.areas.length == 0)
      throw new NotFoundException("Area not found");
    return { uid: user._id, auths: user.authorizations, area: user.areas[0] };
  }

  async getUserArea(_user: AuthentifiedUser, id: ObjectId): Promise<Area> {
    const user = await this.findCurrentUser(_user);
    const area = user.areas.find((a) => a._id.equals(id));
    if (!area) throw new NotFoundException("Area Not Found.");
    return area;
  }

  async getUserAreas(_user: AuthentifiedUser): Promise<Area[]> {
    const user = await this.findCurrentUser(_user);
    return user.areas;
  }

  async addAreaToUser(_user: AuthentifiedUser, area: Area): Promise<User> {
    const user = await this.findCurrentUser(_user);
    user.areas.push(area);
    return await user.save();
  }

  async removeAreaFromUser(_user: AuthentifiedUser, id: ObjectId): Promise<User> {
    const user = await this.findCurrentUser(_user);
    if (!user.areas.find((a) => a._id.equals(id)))
      throw new NotFoundException("Area not found.");
    user.areas = user.areas.filter((a) => !a._id.equals(id));
    return await user.save();
  }

  async updateUserArea(_user: AuthentifiedUser, area: Area): Promise<Area> {
    const user = await this.findCurrentUser(_user);
    const areaIndex = user.areas.findIndex((a) => a._id.equals(area._id));
    if (areaIndex < 0) throw new NotFoundException("AREA not found.");
    user.areas[areaIndex] = area;
    user.save();
    return user.areas[areaIndex];
  }

  async toggleUserArea(_user: AuthentifiedUser, id: ObjectId): Promise<Area> {
    const area = await this.getUserArea(_user, id);
    area.active = !area.active;
    return await this.updateUserArea(_user, area);
  }
}
