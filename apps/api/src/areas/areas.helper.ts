import { ActionTypes, Area, AreaCreationDto, ReactionTypes, Reaction, Action } from '@area/shared';
import { Injectable } from '@nestjs/common';
import { ActionBuilder } from './builders/actions/action.builder';
import { ExampleActionBuilder } from './builders/actions/example.builder';
import { ObjectId } from 'mongodb';

@Injectable()
export class AreasHelper {
    private _actions_builders : Record<ActionTypes, ActionBuilder> = {
        EXAMPLE_ACTION: new ExampleActionBuilder
    }

    // TODO : replace with DB services
    private _reactions_services : Record<ReactionTypes, ObjectId | undefined> = {
        EXAMPLE_REACTION: undefined,
        SEND_EMAIL: undefined
    }

    build(dto: AreaCreationDto) : Area {
        const action : Action = this._actions_builders[dto.action.type]?.build(dto.action);
        const reaction : Reaction = {
            service_id: this._reactions_services[dto.reaction.type],
            informations: dto.reaction
        }
        return {
            _id: new ObjectId(),
            action: action,
            reaction: reaction,
            active: true
        } as Area;
    }
}
