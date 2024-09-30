import { ActionFunction } from './actionFunction';
import { handleExampleAction } from './example/example';

type ActionMap = {
    [string: string]: ActionFunction;
};

export const actionsMap: ActionMap = {
    EXAMPLE_ACTION: handleExampleAction,
};
