import { ObjectId } from "mongodb";

export class AuthorizationDto {
    service_id: ObjectId;
    type: string;
    data: {
        token: string;
        refresh_token: string;
        expirationDate: Date,
        createdAt: Date,
        [key: string]: any;
    };
}