import { WebhookClient } from 'discord.js';
import { DiscordSendingMethodInfo, SendingMethod } from '@area/shared';

export const handleDiscordWebhookSendingMethodFunction = async (method: SendingMethod, title: string, body: string) => {
    const webhookInfos = method as DiscordSendingMethodInfo;
    const webhook_url = webhookInfos.webhook_url;

    const webhook = new WebhookClient({ url: webhook_url });
    try {
        await webhook.send({
            embeds: [
                {
                    title,
                    description: body,
                },
            ],
        });
        return true;
    } catch (error: any) {
        console.error('Error in sending discord webhook: ', error);
        return false;
    }
};
