// admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReactionInfo, Service } from '@area/shared';
import { CreateActionDto } from '@area/shared';
import { CreateServiceDto } from '@area/shared';
import { CreateReactionDto } from '@area/shared';
import { ActionInfo } from '@area/shared';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Service.name) private readonly ServiceModel: Model<Service>) {}

  async createService(createServiceDto: CreateServiceDto): Promise<Service> {
    const createdService = new this.ServiceModel(createServiceDto);
    return createdService.save();
  }

  async addAction(serviceId: string, createActionDto: CreateActionDto): Promise<Service> {
    const service = await this.ServiceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    
    const action: ActionInfo = {
      name: createActionDto.name,
      description: createActionDto.description,
      ActionType: createActionDto.ActionType,
      params: createActionDto.params,
    };

    service.actions.push(action);
    return service.save();
  }

  async addReaction(serviceId: string, createReactionDto: CreateReactionDto): Promise<Service> {
    const service = await this.ServiceModel.findById(serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    
    const reaction: ReactionInfo = {
      name: createReactionDto.name,
      description: createReactionDto.description,
      ActionType: createReactionDto.ActionType,
      params: createReactionDto.params,
    };

    service.reactions.push(reaction);
    return service.save();
  }


  async getAllServices(): Promise<Service[]> {
    return this.ServiceModel.find().exec();
  }
  

  async deleteService(serviceId: string): Promise<void> {
    const result = await this.ServiceModel.deleteOne({ _id: serviceId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Service not found');
    }
  }
}
