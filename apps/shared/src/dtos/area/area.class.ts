import { ObjectId } from "mongodb";
import { Action } from "../actions/action.class";
import { Reaction } from "../reactions/reaction.class";

export class Area {
    _id?: ObjectId;
    action: Action;
    reaction: Reaction;
    active: boolean;
}