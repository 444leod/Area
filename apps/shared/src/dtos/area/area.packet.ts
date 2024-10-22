import { Area } from "./area.class";
import { ObjectId } from "mongodb";
import { AuthorizationDto } from "../user/authorization.dto";

interface Data {
    title: string;
    body: string;
    username: string | undefined;
    picture: string | undefined;
    date: Date | undefined;
}

export interface AreaPacket {
    user_id: ObjectId;
    area: Area;
    data: Data | null;
    authorizations: AuthorizationDto[];
}