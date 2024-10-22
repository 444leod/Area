import { Area, User } from "@area/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { AuthorizationDto } from "@area/shared/dist/dtos/user/authorization.dto";


@Injectable()
export class AreasService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findCurrentUser(token: {
    sub: string;
  }): Promise<(Document<unknown, {}, User> & User) | undefined> {
    const u = await this.userModel.findById(token.sub);
    if (!u) throw new NotFoundException("User not found");
    return u;
  }

  async getWebhookReaById(id: ObjectId): Promise<{uid: ObjectId, auths: AuthorizationDto[], area: Area}> {
    // This will match the user with the correct area id
    // Only 1 area will be present inside the returned document (Projection)
    const user = await this.userModel
      .findOne({ "areas._id": id }, { "_id": 1, "authorizations": 1, "areas.$": 1 })
      .exec();
    if (!user || user.areas.length == 0)
      throw new NotFoundException("Area not found");
    return {uid: user._id, auths: user.authorizations, area: user.areas[0]};
  }

  async getUserArea(token: { sub: string }, id: ObjectId): Promise<Area> {
    const user = await this.findCurrentUser(token);
    const area = user.areas.find((a) => a._id.equals(id));
    if (!area) throw new NotFoundException("Area Not Found.");
    return area;
  }

  async getUserAreas(token: { sub: string }): Promise<Area[]> {
    const user = await this.findCurrentUser(token);
    return user.areas;
  }

  async addAreaToUser(token: { sub: string }, area: Area): Promise<User> {
    const user = await this.findCurrentUser(token);
    user.areas.push(area);
    return await user.save();
  }

  async removeAreaFromUser(
    token: { sub: string },
    id: ObjectId,
  ): Promise<User> {
    const user = await this.findCurrentUser(token);
    if (!user.areas.find((a) => a._id.equals(id)))
      throw new NotFoundException("Area not found.");
    user.areas = user.areas.filter((a) => !a._id.equals(id));
    return await user.save();
  }

  async updateUserArea(token: { sub: string }, area: Area): Promise<Area> {
    const user = await this.findCurrentUser(token);
    const areaIndex = user.areas.findIndex((a) => a._id.equals(area._id));
    if (areaIndex < 0) throw new NotFoundException("AREA not found.");
    user.areas[areaIndex] = area;
    user.save();
    return user.areas[areaIndex];
  }

  async toggleUserArea(token: { sub: string }, id: ObjectId): Promise<Area> {
    const area = await this.getUserArea(token, id);
    area.active = !area.active;
    return await this.updateUserArea(token, area);
  }
}
