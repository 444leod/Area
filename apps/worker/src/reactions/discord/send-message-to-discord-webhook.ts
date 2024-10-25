import { ReactionFunction } from "../reaction-function";
import { AreaPacket, SendMessageToDiscordWebhookInfos } from "@area/shared";
import { WebhookClient, EmbedBuilder } from "discord.js";

export const handleSendMessageToDiscordWebhookReaction: ReactionFunction =
  async (packet: AreaPacket) => {
    const reaction = packet.area.reaction
      .informations as SendMessageToDiscordWebhookInfos;

    try {
      const client = new WebhookClient({
        url: reaction.webhook_url,
      });
      const embed = new EmbedBuilder().setTitle(reaction.title);
      if (reaction.body) {
        embed.setDescription(reaction.body);
      }
      // if (reaction.date) {
      //     embed.setTimestamp(new Date(reaction.date));
      // }
      if (reaction.username) {
        if (reaction.avatar_url) {
          embed.setAuthor({
            name: reaction.username,
            iconURL: reaction.avatar_url,
          });
        } else {
          embed.setAuthor({ name: reaction.username });
        }
      }
      if (reaction.thumbnail_url) {
        embed.setThumbnail(reaction.thumbnail_url);
      }
      await client.send({
        embeds: [embed],
      });
    } catch (error: any) {
      console.error("Error in sending message to discord webhook: ", error);
    }
  };
