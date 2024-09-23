import {isSendEmailDTO, sendEmailDTO} from "../../types/reactions/emails/sendEmailDTO";
import { ReactionFunction, ReactionFunctionObject} from "../reactionFunction";
import nodemailer from "nodemailer";

export const sendEmail: ReactionFunction = async (obj: ReactionFunctionObject) => {
    const reaction = obj.reactionObject

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
        text: emailInformation.content
    }

    return transporter.sendMail(fullMail)
}
