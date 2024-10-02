import {
  ActionTypes,
  Area,
  AreaCreationDto,
  ReactionTypes,
  Reaction,
  Action,
  AreaDto,
} from "@area/shared";
import { Injectable } from "@nestjs/common";
import { ActionBuilder } from "./builders/actions/action.builder";
import { ExampleActionBuilder } from "./builders/actions/example.builder";
import { ObjectId } from "mongodb";

@Injectable()
export class AreasHelper {
  private _actions_builders: Record<ActionTypes, ActionBuilder> = {
    EXAMPLE_ACTION: new ExampleActionBuilder(),
  };

  // TODO : replace with DB services
  private _reactions_services: Record<ReactionTypes, ObjectId | undefined> = {
    EXAMPLE_REACTION: undefined,
    SEND_EMAIL: undefined,
  };

  build(dto: AreaCreationDto): Area {
    const action: Action = this._actions_builders[dto.action.type]?.build(
      dto.action
    );
    const reaction: Reaction = {
      service_id: this._reactions_services[dto.reaction.type],
      informations: dto.reaction,
    };
    return {
      _id: new ObjectId(),
      action: action,
      reaction: reaction,
      active: true,
    } as Area;
  }

  toDto(area: Area): AreaDto {
    return {
      id: area._id,
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
