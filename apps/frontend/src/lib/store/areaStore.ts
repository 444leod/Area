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

function initializeParams(action: Action): Record<string, any> {
	const params: Record<string, any> = {};

	// Initialize each parameter with a default value based on its type
	action.params.forEach(param => {
		switch (param.type) {
			case 'string':
			case 'text':
				params[param.name] = '';
				break;
			case 'number':
				params[param.name] = 0;
				break;
			case 'boolean':
				params[param.name] = false;
				break;
			case 'date':
				params[param.name] = new Date().toISOString();
				break;
			case 'enum':
				// Si des items sont définis, prendre le premier comme valeur par défaut
				params[param.name] = param.items && param.items.length > 0 ? param.items[0] : '';
				break;
			default:
				params[param.name] = '';
		}
	});

	return params;
}

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
					params: initializeParams(trigger)
				}
			})),
		setSelectedAction: (action: Action) =>
			update((state) => ({
				...state,
				selectedAction: action,
				reactionDetails: {
					type: action.type,
					params: initializeParams(action)
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
