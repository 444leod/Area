import { ActionFunctions } from './action-functions';
import { handleExampleAction } from './example/example';
import { handleEachXSecondsAction } from './timer/each-x-seconds-action';

type ActionMap = {
    [string: string]: ActionFunctions;
};

export const actionsMap: ActionMap = {
    EXAMPLE_ACTION: handleExampleAction,
    EACH_X_SECONDS: handleEachXSecondsAction,
};
