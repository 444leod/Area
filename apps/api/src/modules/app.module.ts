import { Module } from '@nestjs/common';
import { AreasModule } from './areas.module';
import { WebhooksModule } from './webhooks.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [ AuthModule, AreasModule, WebhooksModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
