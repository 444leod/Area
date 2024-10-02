import { ObjectId } from "mongodb";
import { ActionInfos } from "./action-infos.class"
import { AnyHistoryDTO } from "../history/any-history.dto";

export class Action {
    service_id: ObjectId;
    informations: ActionInfos;
    history: AnyHistoryDTO;
    isWebhook: boolean;
}