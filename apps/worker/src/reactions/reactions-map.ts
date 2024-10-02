import { ReactionFunctions } from './reaction-functions';
import { handleExampleReaction } from './example/example';

type ReactionMap = {
    [string: string]: ReactionFunctions;
};

export const reactionsMap: ReactionMap = {
    EXAMPLE_REACTION: handleExampleReaction,
};
