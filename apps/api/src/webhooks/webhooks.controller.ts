import { BadRequestException, Controller, HttpCode, Param, Post, Response } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { QueueService } from "src/queue/queue.service";
import { AreasService } from "src/areas/areas.service";
import { ObjectId } from "mongodb";

@ApiTags("Other")
@Controller("webhooks")
export class WebhookController {
  constructor(
    private readonly queueService: QueueService,
    private readonly areasService: AreasService
  ) {}

  @Post("/:id")
  @HttpCode(204)
  async triggerWebhook(@Param("id") id: string): Promise<void> {
    const area = await this.areasService.getAreaById(new ObjectId(id));
    if (!area.action.is_webhook)
      throw new BadRequestException("Requested action is not a Webhook.")
    this.queueService.send(area);
  }
}
