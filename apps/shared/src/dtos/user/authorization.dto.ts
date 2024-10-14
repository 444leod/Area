import { ObjectId } from "mongodb";

export class AuthorizationDto {
    service_id: ObjectId;
    type: string;
    data: {
        token: string;
        refresh_token: string;
        [key: string]: any;
    };
}