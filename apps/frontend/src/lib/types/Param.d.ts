export interface Param {
	name: string;
	type: 'string' | 'number' | 'boolean' | 'enum' | 'date' | 'text';
	required?: boolean;
	items?: string[];
	description?: string;
}