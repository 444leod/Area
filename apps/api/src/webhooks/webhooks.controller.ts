import { BadRequestException, Body, Controller, HttpCode, Param, Post, Req, Response } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { QueueService } from "src/queue/queue.service";
import { AreasService } from "src/areas/areas.service";
import { ObjectId } from "mongodb";
import { Area, AreaPacket, WebhookreaPacket } from "@area/shared";

@ApiTags("Other")
@Controller("webhooks")
export class WebhookController {
  constructor(
    private readonly queueService: QueueService,
    private readonly areasService: AreasService
  ) {}

  @Post("/:id")
  @HttpCode(204)
  async triggerWebhook(@Param("id") id: string, @Req() request): Promise<void> {
    const user = await this.areasService.getWebhookReaById(new ObjectId(id));
    if (!user.area.action.is_webhook)
      throw new BadRequestException("Requested action is not a Webhook.");

    const packet: WebhookreaPacket = {
      user_id: user.uid,
      area: user.area,
      data: {
        headers: request.headers,
        body: request.body
      },
      authorizations: user.auths
    }
    this.queueService.send(packet);
  }
}
