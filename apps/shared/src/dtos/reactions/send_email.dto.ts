import { ReactionTypes } from "./reaction_types.dto";

export interface SendEmailDTO {
    type: ReactionTypes.SEND_EMAIL;
    to: string;
    subject: string;
    body: string;
}