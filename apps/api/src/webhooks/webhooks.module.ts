import { Module } from '@nestjs/common';
import { WebhookController } from '../webhooks/webhooks.controller';
import { WebhookService } from '../webhooks/webhooks.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhooksModule {}
