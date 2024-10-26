import type { ActionInfos, ReactionInfos } from '@area/shared';
import type { App } from './App';
import type { Action } from './Action';

export interface AreaCreationStore {
	currentStep: number;
	triggerApp: App | null;
	actionApp: App | null;
	selectedTrigger: Action | null;
	selectedAction: Action | null;
	automationName: string;
	actionDetails: ActionInfos | null;
	reactionDetails: ReactionInfos | null;
	isValid: boolean;
	errors: string[];
}

export interface AreaStoreActions {
	subscribe: (run: (value: AreaCreationStore) => void) => () => void;
	setStep: (step: number) => void;
	setTriggerApp: (app: App | null) => void;
	setActionApp: (app: App | null) => void;
	setSelectedTrigger: (trigger: Action | null) => void;
	setSelectedAction: (action: Action | null) => void;
	setAutomationName: (name: string) => void;
	setActionDetails: (details: ActionInfos) => void;
	setReactionDetails: (details: ReactionInfos) => void;
	validate: () => boolean;
	reset: () => void;
}
