import { ObjectId } from 'mongodb'
import { Authorization } from "./authorization.schema";
import { Area } from './area.schema';

export class User {
  _id: ObjectId;
  first_name: string;
  last_name: string;
  icon: any; // TODO: find correct type for binary
  email: string;
  password: string;
  authorizations: Authorization[]
  areas: Area[]
}
