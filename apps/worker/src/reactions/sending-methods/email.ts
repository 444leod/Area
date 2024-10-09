import nodemailer from 'nodemailer';
import { EmailSendingMethodInfo, SendingMethod } from '@shared/src';

export async function handleMailSendingMethodFunction(method: SendingMethod, title: string, body: string) {
    const emailInfos = method as EmailSendingMethodInfo;
    const to = emailInfos.to;

    if (!to) {
        console.error('Missing email to send to');
        return false;
    }

    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE_SENDER_HOST,
        auth: {
            user: process.env.MAIL_SERVICE_SENDER_USER,
            pass: process.env.MAIL_SERVICE_SENDER_PASSWORD,
        },
    });

    const fullMail = {
        from: process.env.MAIL_SERVICE_SENDER_USER,
        to,
        subject: title,
        text: body,
    };

    try {
        await transporter.sendMail(fullMail);
        return true;
    } catch (error: any) {
        console.error('Error in sending mail: ', error);
        return false;
    }
}
