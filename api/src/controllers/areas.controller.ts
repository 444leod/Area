import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDTO } from '@shared/dtos/reactions/send_email.dto';
import { SendEmailResponse } from '@shared/dtos/send_email.response';
import { AreasService } from '@api/services/areas.service';

@Controller('/areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  async createEmailArea(
    @Body() createAreaDto: SendEmailDTO,
  ): Promise<SendEmailResponse> {
    return {
      webhook_id: (await this.areasService.createArea(createAreaDto)).toString(),
    };
  }
}
