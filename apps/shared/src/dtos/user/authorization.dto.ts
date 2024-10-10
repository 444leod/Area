import { ObjectId } from "mongodb";

export class AuthorizationDto {
    service_Id: ObjectId;
    type: string;
    data: string;
}