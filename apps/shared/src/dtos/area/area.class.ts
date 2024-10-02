import { ObjectId } from "mongodb";
import { Action, ActionDto } from "../actions/action.class";
import { Reaction } from "../reactions/reaction.class";

export class Area {
    _id: ObjectId;
    active: boolean;
    action: Action;
    reaction: Reaction;
}

export class AreaDto {
    active: boolean;
    action: ActionDto;
    reaction: Reaction;
}