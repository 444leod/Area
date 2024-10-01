import { ActionTypes, AreaDTO, AreaCreationDto, ReactionTypes } from '@area/shared';
import { Injectable } from '@nestjs/common';
import { ActionBuilder } from './builders/actions/action.builder';
import { ExampleActionBuilder } from './builders/actions/example.builder';
import { ObjectId } from 'mongodb';
import { ReactionBuilder } from './builders/reactions/reaction.builder';
import { ExampleReactionBuilder } from './builders/reactions/example.builder';

@Injectable()
export class AreasHelper {
    private _actions_builders : Record<ActionTypes, ActionBuilder> = {
        EXAMPLE_ACTION: new ExampleActionBuilder
    }

    private _reactions_builders : Record<ReactionTypes, ReactionBuilder> = {
        EXAMPLE_REACTION: new ExampleReactionBuilder,
        SEND_EMAIL: undefined
    }

    build(dto: AreaCreationDto) : AreaDTO {
        const action = this._actions_builders[dto.action.type]?.build(dto.action);
        const reaction = this._reactions_builders[dto.reaction.type]?.build(dto.reaction);
        return {
            _id: new ObjectId(),
            action: action,
            reaction: reaction,
            active: true
        };
    }
}
