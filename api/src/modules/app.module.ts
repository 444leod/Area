import { Module } from '@nestjs/common';
import { AreasModule } from './areas.module';
import { WebhooksModule } from './webhooks.module';
import { authModule } from './auth.module';

@Module({
  imports: [ AreasModule, WebhooksModule, authModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
