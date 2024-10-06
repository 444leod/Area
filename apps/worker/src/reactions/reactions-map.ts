import { ReactionFunction } from './reaction-function';
import { handleExampleReaction } from './example/example';
import { handleCreateGoogleTaskReaction } from './google-tasks/create-google-task';

type ReactionMap = {
    [string: string]: ReactionFunction;
};

export const reactionsMap: ReactionMap = {
    EXAMPLE_REACTION: handleExampleReaction,
    CREATE_GOOGLE_TASK: handleCreateGoogleTaskReaction,
};
