import {isSendEmailDTO, sendEmailDTO} from "../../types/reactions/emails/sendEmailDTO";
import { ReactionFunction} from "../reactionFunction";
const nodemailer = require("nodemailer");

export const sendEmail: ReactionFunction = async (reaction: any) => {
    if (!isSendEmailDTO(reaction.data)) {
        console.error(`Reaction ${reaction._id} is not valid`)
        return
    }

    const emailInformation: sendEmailDTO = reaction.data

    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE_SENDER_HOST,
        auth: {
            user: process.env.MAIL_SERVICE_SENDER_USER,
            pass: process.env.MAIL_SERVICE_SENDER_PASSWORD,
        }
    })

    const fullMail = {
        from: process.env.MAIL_SERVICE_SENDER_USER,
        to: emailInformation.to,
        subject: emailInformation.subject,
        text: emailInformation.body
    }

    return transporter.sendMail(fullMail)
}