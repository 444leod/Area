import { Body, Controller, Post } from "@nestjs/common";
import { SendEmailDTO } from "@shared/dto/send_mail.dto";
import { AreasService } from "@api/services/areas.service";


@Controller('/areas')
export class AreasController {

  constructor(private readonly areasService: AreasService) {}

  @Post()
  createArea(@Body() createAreaDto: SendEmailDTO) { // Change type to create area dto
    return this.areasService.createArea(createAreaDto);
  }
}