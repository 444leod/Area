import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { Area, AreaCreationDto, AreaDto } from "@area/shared";
import { AreasHelper } from "./areas.helper";
import { ObjectId } from "mongodb";
import { AreasService } from "./areas.service";
import {
  CreateAreaOkOptions,
  AreasUnauthorizedOptions,
  GetAreasOkOptions,
  AreasNotFoundOptions,
  AreasUserNotFoundOptions,
  AreasNoContentOptions,
  AreasToggleOkOptions,
} from "./swagger-content";
import { AuthRequest } from "../auth/auth-interfaces";

@ApiTags("Areas")
@Controller("/areas")
export class AreasController {
  constructor(
    private readonly areasHelper: AreasHelper,
    private readonly areasService: AreasService,
  ) {}

  @Get("/:id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @ApiOkResponse(GetAreasOkOptions)
  @ApiUnauthorizedResponse(AreasUnauthorizedOptions)
  @ApiNotFoundResponse(AreasNotFoundOptions)
  @ApiNotFoundResponse(AreasUserNotFoundOptions)
  async getAreaById(
    @Request() req: AuthRequest,
    @Param("id") id: string,
  ): Promise<Area> {
    return await this.areasService.getUserArea(req.user, new ObjectId(id));
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @ApiOkResponse(GetAreasOkOptions)
  @ApiUnauthorizedResponse(AreasUnauthorizedOptions)
  @ApiNotFoundResponse(AreasUserNotFoundOptions)
  async getUserAreas(@Request() req: AuthRequest): Promise<AreaDto[]> {
    const areas = await this.areasService.getUserAreas(req.user);
    return areas.map((area) => this.areasHelper.toDto(area));
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @ApiCreatedResponse(CreateAreaOkOptions)
  @ApiUnauthorizedResponse(AreasUnauthorizedOptions)
  @ApiNotFoundResponse(AreasUserNotFoundOptions)
  async createArea(
    @Request() req,
    @Body() dto: AreaCreationDto,
  ): Promise<AreaDto> {
    const area = this.areasHelper.build(dto);
    this.areasService.addAreaToUser(req.user, area);
    return this.areasHelper.toDto(area);
  }

  @Delete("/:id")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @ApiNoContentResponse(AreasNoContentOptions)
  @ApiUnauthorizedResponse(AreasUnauthorizedOptions)
  @ApiNotFoundResponse(AreasNotFoundOptions)
  @ApiNotFoundResponse(AreasUserNotFoundOptions)
  async deleteAreaById(@Request() req, @Param("id") id: string) {
    await this.areasService.removeAreaFromUser(req.user, new ObjectId(id));
  }

  @Patch("/:id/toggle")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @ApiOkResponse(AreasToggleOkOptions)
  @ApiUnauthorizedResponse(AreasUnauthorizedOptions)
  @ApiNotFoundResponse(AreasNotFoundOptions)
  @ApiNotFoundResponse(AreasUserNotFoundOptions)
  async toggleArea(@Request() req, @Param("id") id: string): Promise<AreaDto> {
    const updated = await this.areasService.toggleUserArea(
      req.user,
      new ObjectId(id),
    );
    return this.areasHelper.toDto(updated);
  }
}
