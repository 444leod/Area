import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateActionDto } from '@area/shared';
import { CreateServiceDto } from '@area/shared';
import { CreateReactionDto } from '@area/shared';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('service')
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return this.adminService.createService(createServiceDto);
  }

  @Post('service/:id/action')
  async addAction(
    @Param('id') serviceId: string,
    @Body() createActionDto: CreateActionDto
  ) {
    return this.adminService.addAction(serviceId, createActionDto);
  }

  @Post('service/:id/reaction')
  async addReaction(
    @Param('id') serviceId: string,
    @Body() createReactionDto: CreateReactionDto
  ) {
    return this.adminService.addReaction(serviceId, createReactionDto);
  }

  @Get('services')
  async getAllServices() {
    return this.adminService.getAllServices();
  }

  @Delete('service/:id')
  async deleteService(@Param('id') serviceId: string) {
    return this.adminService.deleteService(serviceId);
  }
}