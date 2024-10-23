import type { Param } from './Param';

export 	interface Action {
    name: string;
    action_type: string;
    params: Param[];
}