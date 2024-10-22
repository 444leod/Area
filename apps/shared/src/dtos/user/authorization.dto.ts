import { ObjectId } from "mongodb";

export class AuthorizationDto {
    service_id: ObjectId;
    type: string;
    data: {
        token: string;
        refresh_token: string;
        expiration_date: Date,
        created_at: Date,
        [key: string]: any;
    };
}