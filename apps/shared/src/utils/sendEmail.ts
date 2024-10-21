import nodemailer from 'nodemailer';

export const sendMail = async (to: string, subject: string, body: string) => {
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE_SENDER_HOST,
        auth: {
            user: process.env.MAIL_SERVICE_SENDER_USER,
            pass: process.env.MAIL_SERVICE_SENDER_PASSWORD,
        },
    });

    const fullMail = {
        from: process.env.MAIL_SERVICE_SENDER_USER,
        to: to,
        subject: subject,
        text: body,
    };

    await transporter.sendMail(fullMail);
}