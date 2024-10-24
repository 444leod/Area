import { ApiProperty } from "@nestjs/swagger";
import { AuthorizationsTypes } from "../authorizations";
import { IsEnum } from "class-validator";

export class DisconnectServiceDto {
    @ApiProperty({ enum: AuthorizationsTypes })
    @IsEnum(AuthorizationsTypes)
    type: AuthorizationsTypes
}