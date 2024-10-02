import { ReactionFunction } from './reaction-function';
import { handleExampleReaction } from './example/example';

type ReactionMap = {
    [string: string]: ReactionFunction;
};

export const reactionsMap: ReactionMap = {
    EXAMPLE_REACTION: handleExampleReaction,
};
