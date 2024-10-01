import { Controller } from "@nestjs/common";
import { WebhookService } from "./webhooks.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Other")
@Controller("webhooks")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
}
