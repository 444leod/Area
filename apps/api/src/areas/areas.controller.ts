import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { Area, AreaCreationDto, AreaDto } from "@area/shared";
import { UsersService } from "../users/users.service";
import { AreasHelper } from "./areas.helper";

@ApiTags("Areas")
@Controller("/areas")
export class AreasController {
  constructor(
    private readonly areasHelper: AreasHelper,
    private readonly usersService: UsersService
  ) {}

  @ApiHeader({
    name: "authorization",
    description: "User API token, given at user login. (Bearer token)",
  })
  @ApiCreatedResponse({
    description: "The AREA was successfully created.",
    example: {
      active: true,
      action: {
        service_id: "deadbeefdeadbeefdeadbeef",
        informations: {
          type: "EXAMPLE_TYPE",
          field: "exampleFieldData",
        },
      },
      reaction: {
        service_id: "deadbeefdeadbeefdeadbeef",
        informations: {
          type: "EXAMPLE_TYPE",
          field: "exampleFieldData",
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "No token provided, or token isn't valid.",
  })
  @Post()
  @UseGuards(AuthGuard)
  async createArea(
    @Request() req,
    @Body() dto: AreaCreationDto
  ): Promise<Area> {
    const area = this.areasHelper.build(dto);
    this.usersService.addAreaToUser(req.user, area);
    return area;
  }

  @ApiHeader({
    name: "authorization",
    description: "User API token, given at Log-In. (Bearer token)",
  })
  @ApiOkResponse({
    description: "The data was successfully fetched.",
    example: [
      {
        active: true,
        action: {
          service_id: "deadbeefdeadbeefdeadbeef",
          informations: {
            type: "EXAMPLE_TYPE",
            field: "exampleFieldData",
          },
        },
        reaction: {
          service_id: "deadbeefdeadbeefdeadbeef",
          informations: {
            type: "EXAMPLE_TYPE",
            field: "exampleFieldData",
          },
        },
      },
      {
        active: false,
        action: {},
        reaction: {},
      },
    ],
  })
  @ApiUnauthorizedResponse({
    description: "No token provided, or token isn't valid.",
  })
  @Get()
  @UseGuards(AuthGuard)
  async getUserAreas(@Request() req): Promise<AreaDto[]> {
    const user = await this.usersService.findByEmail(req.user.email);
    return user.areas.map((area, _) => {
      return {
        active: area.active,
        action: {
          service_id: area.action.service_id,
          informations: area.action.informations,
        },
        reaction: {
          service_id: area.reaction.service_id,
          informations: area.reaction.informations,
        },
      } as AreaDto;
    });
  }
}
