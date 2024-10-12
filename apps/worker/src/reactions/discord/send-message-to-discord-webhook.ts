import { ReactionFunction } from '../reaction-function';
import { AreaPacket, SendMessageToDiscordWebhookInfos } from '@shared/src';
import { WebhookClient, EmbedBuilder } from 'discord.js';

export const handleSendMessageToDiscordWebhookReaction: ReactionFunction = async (packet: AreaPacket) => {
    const reaction = packet.area.reaction.informations as SendMessageToDiscordWebhookInfos;

    const { webhook_url, title, body, date } = reaction;

    try {
        const client = new WebhookClient({
            url: webhook_url,
        });
        const embed = new EmbedBuilder().setTitle(title);
        if (body) {
            embed.setDescription(body);
        }
        if (date) {
            embed.setTimestamp(new Date(date));
        }
        await client.send({
            embeds: [embed],
        });
    } catch (error: any) {
        console.error('Error in sending message to discord webhook: ', error);
    }
};
