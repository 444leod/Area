import { ObjectId } from "mongodb";
import { AnyActionDTO } from "./any_action.dto"
import { AnyHistoryDTO } from "../history/any_history.dto";

export interface ActionDTO {
    _id: ObjectId;
    service_id: ObjectId;
    informations: AnyActionDTO;
    history: AnyHistoryDTO;
    isWebhook: boolean;
}