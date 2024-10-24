import { Controller, Param, Get } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ObjectId } from "mongodb";

@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Get(":id")
  async getServiceById(@Param("id") id: string) {
    return this.servicesService.getServiceById(new ObjectId(id));
  }
}
