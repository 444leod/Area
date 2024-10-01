import { ObjectId } from "mongodb";
import { ActionDTO } from "../actions/action.dto";
import { ReactionDTO } from "../reactions/reaction.dto";

export interface AreaDTO {
    _id: ObjectId;
    action: ActionDTO;
    reaction: ReactionDTO;
    active: boolean;
}