import { Controller, Get, Ip } from "@nestjs/common";
import { ServicesService } from "./services/services.service";

@Controller()
export class AppController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get("/about.json")
  async getAboutJson(@Ip() ip): Promise<object> {
    return {
      client: {
        ip: ip,
      },
      server: {
        current_time: new Date().getTime(),
        services: await this.servicesService.getAllServicesShort(),
      },
    };
  }
}
