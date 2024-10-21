import type { Param } from './Param';

export 	interface Action {
    name: string;
    actionType: string;
    params: Param[];
}