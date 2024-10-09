import { IsEmail, IsNotEmpty } from "class-validator";
import { BaseSendingMethodInfos } from "../sending-method.class";
import { SendingMethodsTypes } from "../sending-methods-types.enum";

export class EmailSendingMethodInfo extends BaseSendingMethodInfos {
    type: SendingMethodsTypes.EMAIL;

    @IsEmail()
    @IsNotEmpty()
    to: string;
}