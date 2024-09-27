import { Module } from '@nestjs/common';
import { AreasModule } from './areas.module';
import { WebhooksModule } from './webhooks.module';

@Module({
  imports: [ AreasModule, WebhooksModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
