import type { Param } from './Param';

export 	interface Action {
    name: string;
    type: string;
    params: Param[];
}