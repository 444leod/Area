import { ObjectId } from "mongodb";
import { AnyReactionDTO } from "./any-reaction.dto"

export interface ReactionDTO {
    service_id: ObjectId;
    informations: AnyReactionDTO;
}