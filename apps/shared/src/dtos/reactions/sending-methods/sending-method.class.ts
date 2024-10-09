import { SendingMethodsTypes } from "./sending-methods-types.enum";
import { IsEnum } from "class-validator";
import { EmailSendingMethodInfo } from "./email/email.class";
import { DiscordSendingMethodInfo } from "./discord/discord.class";

export class BaseSendingMethodInfos {
    @IsEnum(SendingMethodsTypes)
    type: SendingMethodsTypes
}

export type SendingMethod = EmailSendingMethodInfo | DiscordSendingMethodInfo;