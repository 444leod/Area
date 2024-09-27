import { ExampleReactionDTO } from "./example-reaction.dto";
import { SendEmailDTO } from "./send-email.dto";

export type AnyReactionDTO = ExampleReactionDTO | SendEmailDTO;