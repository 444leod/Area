import { ReactionTypes, ExampleReactionDTO, ReactionDTO } from "@area/shared";
import { ReactionBuilder } from "./reaction.builder";

export class ExampleReactionBuilder implements ReactionBuilder {
    build(dto: ExampleReactionDTO) : ReactionDTO {
        return {
            service_id: undefined,
            informations: dto
        }
    }
}