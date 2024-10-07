import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Service } from '@area/shared';
import { ServiceSchema } from './service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema   }]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
