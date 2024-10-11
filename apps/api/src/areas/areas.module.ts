import { Module } from '@nestjs/common';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { UsersModule } from '../users/users.module';
import { AreasHelper } from './areas.helper';

@Module({
  imports: [UsersModule],
  controllers: [AreasController],
  providers: [AreasService, AreasHelper],
})
export class AreasModule {}
