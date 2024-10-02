import { Area } from "./area.class";
import { ObjectId } from "mongodb";

export interface AreaPacket {
    user_id: ObjectId;
    area: Area;
}