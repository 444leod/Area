import { ReactionDTO, AnyReactionDTO } from "@area/shared";

export abstract class ReactionBuilder {
    abstract build (dto: AnyReactionDTO) : ReactionDTO;
}