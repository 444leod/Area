import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from '@area/shared';
import { ServiceSchema } from './service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema   }]),
  ],
  controllers: [ServicesController],
  exports: [ServicesService],
  providers: [ServicesService],
})
export class ServicesModule {}
