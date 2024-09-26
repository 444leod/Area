import { ObjectId } from "mongodb";
import { AnyReactionDTO } from "./any_reaction.dto"

export interface ReactionDTO {
    _id: ObjectId;
    service_id: ObjectId;
    informations: AnyReactionDTO;
}