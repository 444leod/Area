import { Module } from "@nestjs/common";
import { WebhookController } from "../webhooks/webhooks.controller";
import { QueueModule } from "src/queue/queue.module";
import { AreasModule } from "src/areas/areas.module";

@Module({
  imports: [QueueModule, AreasModule],
  controllers: [WebhookController],
})
export class WebhooksModule {}
