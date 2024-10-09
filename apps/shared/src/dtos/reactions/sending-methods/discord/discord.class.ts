import { IsNotEmpty, IsString } from "class-validator";
import { BaseSendingMethodInfos } from "../sending-method.class";
import { SendingMethodsTypes } from "../sending-methods-types.enum";

export class DiscordSendingMethodInfo extends BaseSendingMethodInfos {
    type: SendingMethodsTypes.DISCORD;

    @IsString()
    @IsNotEmpty()
    webhook_url: string;
}