import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ActionCreationDto } from '@area/shared';
import { ReactionCreationDto } from '@area/shared';
import { ServiceCreationDto } from '@area/shared';
import { ObjectId } from 'mongodb';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return this.servicesService.getServiceById(new ObjectId(id));
  }

  @Post()
  async createService(@Body() createServiceDto: ServiceCreationDto) {
    return this.servicesService.createService(createServiceDto);
  }

  @Post(':id/action')
  async addAction(
    @Param('id') serviceId: string,
    @Body() createActionDto: ActionCreationDto
  ) {
    return this.servicesService.addAction(serviceId, createActionDto);
  }

  @Post(':id/reaction')
  async addReaction(
    @Param('id') serviceId: string,
    @Body() createReactionDto: ReactionCreationDto
  ) {
    return this.servicesService.addReaction(serviceId, createReactionDto);
  }

  @Delete(':id')
  async deleteService(@Param('id') serviceId: string) {
    return this.servicesService.deleteService(serviceId);
  }
}