import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AreasModule } from './areas.module';
import { WebhooksModule } from './webhooks.module';

@Module({
  imports: [ AreasModule, WebhooksModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
