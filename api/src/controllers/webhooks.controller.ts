import { Controller, Post, Body, Headers, Param } from "@nestjs/common";
import { WebhookService } from "@api/services/webhooks.service";

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post(':id')
  async activateWebhook(
    @Body() body: any,
    @Param('id') id: string,
    @Headers() headers: any
  ) {
    const payload = {
      headers,
      body,
      w_id: id
    };
    return await this.webhookService.activate(payload);
  }
}