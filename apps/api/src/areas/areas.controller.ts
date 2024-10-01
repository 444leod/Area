import { Controller } from "@nestjs/common";
import { AreasService } from "./areas.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Areas")
@Controller("/areas")
export class AreasController {
  constructor(private readonly areasService: AreasService) {}
}
