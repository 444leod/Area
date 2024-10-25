import type { Param } from './Param';

export interface Action {
	name: string;
	type: string;
	description?: string;
	params: Param[];
	authorizations: string[];
	variables?: Array<{
		name: string;
		type: string;
		description: string;
		template: string;
	}>;
}