import { ObjectId } from 'mongodb';
import { Action, ActionDto } from '../actions';
import { Reaction } from '../reactions';

export class Area {
  _id: ObjectId;
  active: boolean;
  action: Action;
  reaction: Reaction;
}

export class AreaDto {
  _id: ObjectId;
  active: boolean;
  action: ActionDto;
  reaction: Reaction;
}
