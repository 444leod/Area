import { ObjectId } from "mongodb";
import { AnyActionDTO } from "./any-action.dto"
import { AnyHistoryDTO } from "../history/any-history.dto";

export interface ActionDTO {
    _id: ObjectId;
    service_id: ObjectId;
    informations: AnyActionDTO;
    history: AnyHistoryDTO;
    isWebhook: boolean;
}