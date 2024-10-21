import { ApiProperty, } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ActionCreationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsNotEmpty()
    @ApiProperty()
    actionType: string

    @ApiProperty({ type: [Object], default: [] })
    params: { name: string; type: 'string' | 'number';}[];
}

export class ActionInfo {

    @ApiProperty()
    @IsEmail()
    name: string

    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsNotEmpty()
    @ApiProperty()
    actionType: string

    @ApiProperty({ type: [Object] })
    params: { name: string; type: 'string' | 'number';}[];
}