import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ActionTypes, ReactionTypes, Service, ShortService } from "@area/shared";
import { ObjectId } from "mongodb";
import * as fs from "fs";

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
}
