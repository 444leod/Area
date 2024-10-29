// frontend/src/lib/store/areaStore.ts
import { writable } from 'svelte/store';
import type { Action, App } from '@area/shared';

interface ActionDetails {
	type: string;
	params: Record<string, any>;
}

interface AreaStore {
	currentStep: number;
	triggerApp: App | null;
	actionApp: App | null;
	selectedTrigger: Action | null;
	selectedAction: Action | null;
	automationName: string;
	actionDetails: ActionDetails | null;
	reactionDetails: ActionDetails | null;
}

const initialState: AreaStore = {
	currentStep: 0,
	triggerApp: null,
	actionApp: null,
	selectedTrigger: null,
	selectedAction: null,
	automationName: '',
	actionDetails: null,
	reactionDetails: null
};

function createAreaStore() {
	const { subscribe, set, update } = writable<AreaStore>(initialState);

	return {
		subscribe,
		setTriggerApp: (app: App) => update((state) => ({ ...state, triggerApp: app })),
		setActionApp: (app: App) => update((state) => ({ ...state, actionApp: app })),
		setSelectedTrigger: (trigger: Action) =>
			update((state) => ({
				...state,
				selectedTrigger: trigger,
				actionDetails: {
					type: trigger.type,
					params: {}
				}
			})),
		setSelectedAction: (action: Action) =>
			update((state) => ({
				...state,
				selectedAction: action,
				reactionDetails: {
					type: action.type,
					params: {}
				}
			})),
		setAutomationName: (name: string) =>
			update((state) => ({
				...state,
				automationName: name
			})),
		updateActionParam: (paramName: string, value: any) =>
			update((state) => ({
				...state,
				actionDetails: {
					...state.actionDetails,
					params: {
						...(state.actionDetails?.params || {}),
						[paramName]: value
					}
				}
			})),
		updateReactionParam: (paramName: string, value: any) =>
			update((state) => ({
				...state,
				reactionDetails: {
					...state.reactionDetails,
					params: {
						...(state.reactionDetails?.params || {}),
						[paramName]: value
					}
				}
			})),
		reset: () => set(initialState)
	};
}

export const areaStore = createAreaStore();
