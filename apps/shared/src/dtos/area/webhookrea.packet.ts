import { ObjectId } from "mongodb";
import { Area } from "./area.class";
import { AuthorizationDto } from "../user/authorization.dto";

export interface WebhookData {
    header: {[key: string]: any}
    body: {[key: string]: any}
}

export interface WebhookreaPacket {
    user_id: ObjectId;
    area: Area;
    data: WebhookData | null;
    authorizations: AuthorizationDto[];
}