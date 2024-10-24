import { ReactionFunction } from '../reaction-function';
import { AreaPacket, SendEmailReactionInfos, sendMail } from '@area/shared';

export const handleSendEmailReaction: ReactionFunction = async (
  packet: AreaPacket,
) => {
  const reaction = packet.area.reaction.informations as SendEmailReactionInfos;

  await sendMail(reaction.to, reaction.subject, reaction.body);
};
