import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { Area, AreaCreationDto, AreaDto } from "@area/shared";
import { UsersService } from "../users/users.service";
import { AreasHelper } from "./areas.helper";
import { ObjectId } from "mongodb";

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
    required: true,
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
  ): Promise<AreaDto> {
    const area = this.areasHelper.build(dto);
    this.usersService.addAreaToUser(req.user, area);
    return this.areasHelper.toDto(area);
  }

  @ApiHeader({
    name: "authorization",
    description: "User API token, given at Log-In. (Bearer token)",
    required: true,
  })
  @ApiOkResponse({
    description: "The data was successfully fetched.",
    example: [
      {
        _id: "deadbeefdeadbeefdeadbeef",
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
        _id: "...",
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
    const user = await this.usersService.findById(req.user.sub);
    if (!user) throw new UnauthorizedException("Unknown user");
    return user.areas.map((area, _) => this.areasHelper.toDto(area));
  }

  @ApiHeader({
    name: "authorization",
    description: "User API token, given at user login. (Bearer token)",
    required: true,
  })
  @ApiOkResponse({
    description: "The data was successfully fetched.",
    example: {
      _id: "deadbeefdeadbeefdeadbeef",
      active: true,
      action: {
        isWebhook: false,
        service_id: "deadbeefdeadbeefdeadbeef",
        informations: {
          type: "EXAMPLE_TYPE",
          field: "exampleFieldData",
        },
        history: {
          type: "EXAMPLE_TYPE",
          exampleHistory: [],
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
  @ApiNotFoundResponse({
    description: "User's AREA Not found.",
  })
  @Get("/:id")
  @UseGuards(AuthGuard)
  async getAreaById(@Request() req, @Param("id") id: string): Promise<Area> {
    const user = await this.usersService.findById(req.user.sub);
    if (!user) throw new UnauthorizedException("Unknown user");
    const area = user.areas.find((_a) => _a._id.toHexString() === id);
    if (!area) throw new NotFoundException("AREA not found");
    return area;
  }

  @ApiHeader({
    name: "authorization",
    description: "User API token, given at user login. (Bearer token)",
    required: true,
  })
  @ApiOkResponse({
    description: "Content was successfully deleted.",
  })
  @ApiUnauthorizedResponse({
    description: "No token provided, or token isn't valid.",
  })
  @ApiNotFoundResponse({
    description: "User's AREA Not found.",
  })
  @Delete("/:id")
  @UseGuards(AuthGuard)
  async deleteAreaById(@Request() req, @Param("id") id: string) {
    await this.usersService.removeAreaFromUser(req.user, id);
  }
}
