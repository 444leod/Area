import { Area } from "./area.class";
import { ObjectId } from "mongodb";
import { AuthorizationDto } from "../user/authorization.dto";

interface Data {
    title: string;
    body: string;
}

export interface AreaPacket {
    user_id: ObjectId;
    area: Area;
    data: Data | null;
    authorizations: AuthorizationDto[];
}