import { Controller, Param, Post } from "@nestjs/common";
import { WebhookService } from "./webhooks.service";
import { ApiTags } from "@nestjs/swagger";
import { RabbitMQService } from "@area/shared";

@ApiTags("Other")
@Controller("webhooks")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("/:id")
  triggerWebhook(@Param("id") id: string): void {}
}
