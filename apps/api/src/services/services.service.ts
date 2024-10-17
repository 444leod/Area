import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {ReactionInfo, Service} from '@area/shared';
import { ActionCreationDto, ServiceCreationDto, ReactionCreationDto, ActionInfo } from '@area/shared';
import { ObjectId } from 'mongodb';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Service.name) private readonly serviceModel: Model<Service>) {}


  async getAllServices(): Promise<Service[]> {
    return this.serviceModel.find().exec();
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
      ActionType: actionCreationDto.ActionType,
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
      ActionType: reactionCreationDto.ActionType,
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
