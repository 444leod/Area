import { ObjectId } from "mongodb";
import { ActionInfos } from "./action-infos.class";
import { AnyHistory } from "../history";

export class Action {
  service_id: ObjectId;
  informations: ActionInfos;
  history: AnyHistory;
  is_webhook: boolean;
}

export class ActionDto {
  service_id: ObjectId;
  informations: ActionInfos;
}
