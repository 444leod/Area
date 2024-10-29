import { ObjectId } from "mongodb";
import { Action, ActionDto } from "../actions";
import { Reaction } from "../reactions";
import { Log } from "../log";

export class Area {
  _id: ObjectId;
  name: string;
  active: boolean;
  action: Action;
  reaction: Reaction;
  logs: Log[];
}

export class AreaDto {
  _id: ObjectId;
  name: string;
  active: boolean;
  action: ActionDto;
  reaction: Reaction;
  logs: Log[];
}
