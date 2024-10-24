import { ObjectId } from "mongodb";
import { Action, ActionDto } from "../actions";
import { Reaction } from "../reactions";
import { AuthorizationsTypes } from "../authorizations";

export class Area {
  _id: ObjectId;
  name: string;
  active: boolean;
  action: Action;
  reaction: Reaction;
}

export class AreaDto {
  _id: ObjectId;
  name: string;
  active: boolean;
  action: ActionDto;
  reaction: Reaction;
}
