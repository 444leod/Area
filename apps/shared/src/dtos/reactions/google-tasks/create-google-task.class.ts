import {IsNotEmpty, IsString, ValidateNested, IsOptional} from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ReactionTypes } from "../reaction-types.enum";
import { ApiProperty } from "@nestjs/swagger";

class CreateGoogleTaskContent {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    // @IsDate()
    // @IsNotEmpty()
    // date: Date;
}

export class CreateGoogleTaskInfos extends BaseReactionInfos {
    type: ReactionTypes.CREATE_GOOGLE_TASK;

    @ApiProperty()
    @ValidateNested()
    @IsOptional()
    content: CreateGoogleTaskContent | null;
}