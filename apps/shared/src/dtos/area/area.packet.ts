import { Area } from "./area.class";
import { ObjectId } from "mongodb";

interface Data {
  title: string;
  body: string;
}

export interface AreaPacket {
  user_id: ObjectId;
  area: Area;
  data: Data | null;
}
