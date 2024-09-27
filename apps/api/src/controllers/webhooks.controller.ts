import { Controller, Post, Body, Headers, Param, HttpCode } from "@nestjs/common";
import { WebhookService, WebhookResponse } from "../services/webhooks.service";
import { ObjectId } from "mongodb";

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Post(':id')
  @HttpCode(200)
  async activateWebhook(
    @Body() body: any,
    @Param('id') id: string,
    @Headers() headers: any
  ): Promise<WebhookResponse> {
    return await this.webhookService.activate({
      webhook_id: new ObjectId(id),
      headers,
      body,
    });
  }
}