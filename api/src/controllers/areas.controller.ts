import { Body, Controller, Post } from "@nestjs/common";
import { SendEmailDTO } from "@shared/dto/send_mail.dto";
import { SendEmailResponse } from "@shared/dto/send_email.response";
import { AreasService } from "@api/services/areas.service";

@Controller('/areas')
export class AreasController {

  constructor(private readonly areasService: AreasService) {}

  @Post()
  async createArea(@Body() createAreaDto: SendEmailDTO) : Promise<SendEmailResponse> { // Change type to create area dto
    return {
      webhook_id: await this.areasService.createArea(createAreaDto).toString()
    }
  }
}