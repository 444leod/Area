import { AreaDTO } from "./area.dto";
import { ObjectId } from "mongodb";

export interface AreaPacket {
    userId: ObjectId;
    area: AreaDTO;
}