import { ObjectId } from "mongodb";
import { ReactionInfos } from "./reaction-infos.class";

export class Reaction {
  service_id: ObjectId;
  informations: ReactionInfos;
}
