import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {ReactionInfo, Service, ShortService} from '@area/shared';
import { ActionCreationDto, ServiceCreationDto, ReactionCreationDto, ActionInfo } from '@area/shared';
import { ObjectId } from 'mongodb';
import * as SERVICES from '../../services.json'
import * as fs from 'fs';

@Injectable()
export class ServicesService {
  constructor(@InjectModel(Service.name) private readonly serviceModel: Model<Service>) {}

    // Delete all services from DB
    await this.serviceModel.deleteMany({});

    // Put services in DB from JSON
    const json_services: Service[] = SERVICES['default'];
    json_services.forEach(async (service) => {
      service._id = service._id != undefined ? new ObjectId(service._id) : new ObjectId();
      await this.serviceModel.create(service);
    });

    // Update JSON with potential new IDs
    fs.writeFile('services.json', JSON.stringify(json_services, null, 2), () => {});
  }

  constructor(@InjectModel(Service.name) private readonly serviceModel: Model<Service>) {
    this.updateServicesFromJson();
  }

  async getAllServices(): Promise<Service[]> {
    return this.serviceModel.find().exec();
  }

  async getAllServicesShort(): Promise<ShortService[]> {
    const services: Service[] = await this.serviceModel.find().exec();
    return services.map((value, _) => {
      const short: ShortService = {
        name: value.name,
        actions: value.actions.map((a, _) => {return {name: a.name, description: a.description}}),
        reactions: value.reactions.map((r, _) => {return {name: r.name, description: r.description}}),
      }
      return short;
    });
  }

  async getServiceByName(name: string): Promise<Service | undefined> {
    return await this.serviceModel.findOne({ name: name }).exec();
  }

  async getServiceById(id: ObjectId): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service)
      throw new NotFoundException("Unknown service.");
    return service;
  }

  async createService(serviceCreationDto: ServiceCreationDto): Promise<Service> {
    const createdService = new this.serviceModel(serviceCreationDto);
    return createdService.save();
  }

  async addAction(serviceId: string, actionCreationDto: ActionCreationDto): Promise<Service> {
    const service = await this.serviceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const action: ActionInfo = {
      name: actionCreationDto.name,
      description: actionCreationDto.description,
      action_type: actionCreationDto.action_type,
      params: actionCreationDto.params,
    };

    service.actions.push(action);
    return service.save();
  }

  async addReaction(serviceId: string, reactionCreationDto: ReactionCreationDto): Promise<Service> {
    const service = await this.serviceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const reaction: ReactionInfo = {
      name: reactionCreationDto.name,
      description: reactionCreationDto.description,
      reaction_type: reactionCreationDto.reaction_type,
      params: reactionCreationDto.params,
    };

    service.reactions.push(reaction);
    return service.save();
  }

  async deleteService(serviceId: string): Promise<void> {
    const result = await this.serviceModel.deleteOne({ _id: serviceId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Service not found');
    }
  }
}
