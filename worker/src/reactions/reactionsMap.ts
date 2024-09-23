import { ReactionFunction } from "./reactionFunction";
import {sendEmail} from "./emails/sendEmail";

type ReactionMap = {
    [key: string]: ReactionFunction
}

export const reactionsMap: ReactionMap = {
    sendEmail: sendEmail,
}