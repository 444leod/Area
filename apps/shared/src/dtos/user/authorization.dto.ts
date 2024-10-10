import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongodb";

export class AuthorizationDto {

    @ApiProperty()
    @IsEmail()
    service_id: ObjectId

    @IsNotEmpty()
    @ApiProperty()
    type: string

    @IsNotEmpty()
    @ApiProperty()
    data: string

}