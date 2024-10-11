import { Area } from './area';
import { ObjectId } from 'mongodb';

export interface AreaPacket {
  userId: ObjectId;
  area: Area;
}
