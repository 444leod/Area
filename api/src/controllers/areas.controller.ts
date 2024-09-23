import { Body, Controller, Post } from "@nestjs/common";
import { AreasService } from "src/services/areas.service";


@Controller('/areas')
export class AreasController {

  constructor(private readonly areasService: AreasService) {}

  @Post()
  createArea(@Body() createAreaDto: any) { // Change type to create area dto
    return this.areasService.example();
  }
}