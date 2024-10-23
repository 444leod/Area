import {IsNotEmpty, IsString, IsOptional } from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ReactionTypes } from "../reaction-types.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateOrVariable } from "../../../validators";

export class CreateGoogleTaskInfos extends BaseReactionInfos {
    type: ReactionTypes.CREATE_GOOGLE_TASK;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    body: string;

    @ApiProperty()
    @IsOptional()
    @IsDateOrVariable()
    date: string;
}
