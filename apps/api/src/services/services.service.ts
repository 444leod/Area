import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ActionTypes,
  AuthorizationsTypes,
  ReactionTypes,
  Service,
  ShortService,
} from "@area/shared";
import { ObjectId } from "mongodb";
import * as fs from "fs";
import { ServiceTypeList } from "./service-type-list.interface";

@Injectable()
export class ServicesService {
  area_services = new Map<ActionTypes | ReactionTypes, ObjectId>();

  async updateServicesFromJson(): Promise<void> {
    const read_data: string = fs.readFileSync("services.json", "utf8");
    const services: Service[] = JSON.parse(read_data);
    await this.serviceModel.deleteMany({});
    for (const service of services) {
      service._id = new ObjectId();
      this.serviceModel.create(service);
      for (const area of [...service.actions, ...service.reactions]) {
        this.area_services[area.type] = service._id;
      }
    }
  }

  constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
  ) {
    this.updateServicesFromJson();
  }

  async getAllServices(): Promise<Service[]> {
    return this.serviceModel.find().exec();
  }

  async getAllServicesShort(): Promise<ShortService[]> {
    const services: Service[] = await this.serviceModel.find().exec();
    return services.map((value) => {
      const short: ShortService = {
        name: value.name,
        actions: value.actions.map((a) => {
          return { name: a.name, description: a.description };
        }),
        reactions: value.reactions.map((r) => {
          return { name: r.name, description: r.description };
        }),
      };
      return short;
    });
  }

  async getServiceByName(name: string): Promise<Service | undefined> {
    return await this.serviceModel.findOne({ name: name }).exec();
  }

  async getServiceById(id: ObjectId): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) throw new NotFoundException("Unknown service.");
    return service;
  }

  async getServicesNamesByReactionTypes(
    types: ReactionTypes[],
  ): Promise<string[]> {
    const services = await this.serviceModel.find(
      { "reactions.type": { $in: types } },
      { name: 1 },
    );
    return services.map((service) => service.name);
  }

  async getAreaTypesFromAuthType(
    authType: AuthorizationsTypes,
  ): Promise<ServiceTypeList> {
    let service: Service;
    const types: ServiceTypeList = {
      actionTypes: [],
      reactionTypes: [],
    };
    service = await this.serviceModel
      .findOne({ "actions.authorizations": authType }, { "actions.$": 1 })
      .exec();
    if (service)
      for (const action of service.actions) types.actionTypes.push(action.type);
    service = await this.serviceModel
      .findOne({ "reactions.authorizations": authType }, { "reactions.$": 1 })
      .exec();
    if (service)
      for (const reaction of service.reactions)
        types.reactionTypes.push(reaction.type);
    return types;
  }
}
