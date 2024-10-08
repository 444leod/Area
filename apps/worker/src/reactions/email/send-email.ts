import { ReactionFunction } from '../reaction-function';
import { AreaPacket, SendEmailReactionInfos } from '@area/shared';
import nodemailer from 'nodemailer';

export const handleSendEmailReaction: ReactionFunction = async (packet: AreaPacket) => {
    const reaction = packet.area.reaction.informations as SendEmailReactionInfos;

    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE_SENDER_HOST,
        auth: {
            user: process.env.MAIL_SERVICE_SENDER_USER,
            pass: process.env.MAIL_SERVICE_SENDER_PASSWORD,
        },
    });

    const fullMail = {
        from: process.env.MAIL_SERVICE_SENDER_USER,
        to: reaction.to,
        subject: reaction.subject,
        text: reaction.body,
    };

    await transporter.sendMail(fullMail);
};