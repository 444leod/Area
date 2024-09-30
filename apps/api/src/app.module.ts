import { Module } from '@nestjs/common';
import { AreasModule } from './areas/areas.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    AuthModule, AreasModule, WebhooksModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
