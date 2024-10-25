import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthorizationsTypes, Service, ShortService } from "@area/shared";
import { ObjectId } from "mongodb";
import * as fs from "fs";
import { ServiceTypeList } from "./service-type-list.interface";

@Injectable()
export class ServicesService {
  async updateServicesFromJson(): Promise<void> {
    const read_data: string = fs.readFileSync("services.json", "utf8");
    const services: Service[] = JSON.parse(read_data);
    for (const service of services) {
      if (service._id != undefined) {
        service._id = new ObjectId(service._id);
        await this.serviceModel.findByIdAndUpdate(service._id, service);
      } else {
        service._id = new ObjectId();
        await this.serviceModel.create(service);
      }
    }
    const data = JSON.stringify(services, null, 2);
    fs.writeFile("services.json", data, () => {});
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
