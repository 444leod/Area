import { SendingMethod } from '@area/shared';
import { handleMailSendingMethodFunction } from './sending-methods/email';
import { handleDiscordWebhookSendingMethodFunction } from './sending-methods/discord';
import { SendingMethodFunction } from './sending-method-function';

type SendingMethodFunctionMap = {
    [string: string]: SendingMethodFunction;
};

export const sendingMethodsFunctionsMap: SendingMethodFunctionMap = {
    EMAIL: handleMailSendingMethodFunction,
    DISCORD: handleDiscordWebhookSendingMethodFunction,
};

export async function sendDataThroughSelectedMethod(method: SendingMethod, title: string, body: string): Promise<boolean> {
    const type = method.type;

    const sendingMethodFunction = sendingMethodsFunctionsMap[type];

    if (!sendingMethodFunction) {
        console.error('Sending method not found.');
        return false;
    }

    return await sendingMethodFunction(method, title, body);
}
