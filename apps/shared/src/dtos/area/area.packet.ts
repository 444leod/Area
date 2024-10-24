import { Area } from "./area.class";
import { ObjectId } from "mongodb";
import { AuthorizationDto } from "../user/authorization.dto";

export interface AreaPacket {
    user_id: ObjectId;
    area: Area;
    data: { [key: string]: any };
    authorizations: AuthorizationDto[];
}