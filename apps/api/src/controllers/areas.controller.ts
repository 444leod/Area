import { Body, Controller, Get, Post } from "@nestjs/common";
import { SendEmailDTO } from "@area/shared";
import { AreasService } from "../services/areas.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Areas")
@Controller("/areas")
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  async createEmailArea(@Body() createAreaDto: SendEmailDTO): Promise<any> {
    return {
      webhook_id: (
        await this.areasService.createArea(createAreaDto)
      ).toString(),
    };
  }
  @Get("/ping")
  async ping() {
    return ("pong ici laaaa");
  }
}
