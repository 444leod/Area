import {
  Action,
  Reaction,
  Area,
  AreaCreationDto,
  AreaDto,
  HistoryRegistry,
} from "@area/shared";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ServicesService } from "src/services/services.service";

@Injectable()
export class AreasHelper {
  constructor(private readonly servicesService: ServicesService) {}

  build(dto: AreaCreationDto): Area {
    const action: Action = {
      service_id: this.servicesService.area_services[dto.action.type],
      informations: dto.action,
      history: HistoryRegistry.create(dto.action.type),
      is_webhook: false, // TODO
    };
    const reaction: Reaction = {
      service_id: this.servicesService.area_services[dto.reaction.type],
      informations: dto.reaction,
    };
    return {
      _id: new ObjectId(),
      name: dto.name,
      action: action,
      reaction: reaction,
      active: true,
    };
  }

  toDto(area: Area): AreaDto {
    return {
      _id: area._id,
      name: area.name,
      active: area.active,
      action: {
        service_id: area.action.service_id,
        informations: area.action.informations,
      },
      reaction: {
        service_id: area.reaction.service_id,
        informations: area.reaction.informations,
      },
    };
  }
}
