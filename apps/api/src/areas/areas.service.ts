import {
  Area,
  User,
  AuthorizationDto,
  ActionTypes,
  ReactionTypes,
  AreaTypesCount,
} from "@area/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { AuthentifiedUser } from "../auth/auth-interfaces";

@Injectable()
export class AreasService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findCurrentUser(
    user: AuthentifiedUser,
  ): Promise<Document<unknown, unknown, User> & User> {
    const u = await this.userModel.findById(user.id);
    if (!u) throw new NotFoundException("User not found");
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

  async removeAreaFromUser(
    _user: AuthentifiedUser,
    id: ObjectId,
  ): Promise<User> {
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

  async getAreasCounts(): Promise<{ all: number; active: number }> {
    const users = await this.userModel.find({}, { "areas._id": 1 });
    let all_count: number = 0;
    let active_count: number = 0;

    for (const u of users) {
      all_count += u.areas.length;
      active_count += u.areas.filter((a) => a.active == true).length;
    }
    return {
      all: all_count,
      active: active_count,
    };
  }

  async getAreaTypesCount(): Promise<{
    actions: AreaTypesCount;
    reactions: AreaTypesCount;
  }> {
    const users = await this.userModel.find(
      {},
      {
        "areas.action.informations.type": 1,
        "areas.reaction.informations.type": 1,
      },
    );
    const actionsTypes: ActionTypes[] = [];
    const reactionsTypes: ReactionTypes[] = [];
    const actionsCount: AreaTypesCount = {};
    const reactionsCount: AreaTypesCount = {};

    for (const u of users) {
      actionsTypes.push(...u.areas.map((a) => a.action.informations.type));
      reactionsTypes.push(...u.areas.map((a) => a.reaction.informations.type));
    }
    for (const action of actionsTypes)
      actionsCount[action] = actionsCount[action]
        ? actionsCount[action] + 1
        : 1;
    for (const reaction of reactionsTypes)
      reactionsCount[reaction] = reactionsCount[reaction]
        ? reactionsCount[reaction] + 1
        : 1;
    return {
      actions: actionsCount,
      reactions: reactionsCount,
    };
  }
}
