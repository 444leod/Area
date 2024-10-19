import {IsNotEmpty, IsString} from "class-validator";
import { BaseReactionInfos } from "../reaction-infos.class";
import { ReactionTypes } from "../reaction-types.enum";

export class SendMessageToDiscordWebhookInfos extends BaseReactionInfos {
    type: ReactionTypes.SEND_MESSAGE_TO_DISCORD_WEBHOOK;

    @IsString()
    @IsNotEmpty()
    webhook_url: string;

    // @IsString()
    // @IsNotEmpty()
    // title: string;
    //
    // @IsString()
    // @IsOptional()
    // body?: string;
    //
    // @IsDateString()
    // @IsOptional()
    // date?: string;
}