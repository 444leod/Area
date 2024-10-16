import type { Param } from './Param';

export 	interface Action {
    name: string;
    ActionType: string;
    params: Param[];
}