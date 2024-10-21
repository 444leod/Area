import { ReactionFunction } from '../reaction-function';
import { AreaPacket, SendScrobbleReportByEmailInfos, sendMail } from '@area/shared';

export const handleSendScrobbleReportByMailReaction: ReactionFunction = async (packet: AreaPacket) => {
    const reaction = packet.area.reaction.informations as SendScrobbleReportByEmailInfos;

    await sendMail(reaction.to, reaction.subject, reaction.body);
};
