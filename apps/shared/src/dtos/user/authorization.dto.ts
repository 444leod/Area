import { ObjectId } from "mongodb";

export class AuthorizationDto {
    service_id: ObjectId;
    type: string;
    data: string;
}