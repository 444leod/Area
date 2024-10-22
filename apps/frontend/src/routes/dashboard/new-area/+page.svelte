<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import ProgressBar from '$lib/components/new-area/ProgressBar.svelte';
	import MobileIndicator from '$lib/components/new-area/MobileIndicator.svelte';
	import AppCard from '$lib/components/new-area/AppCard.svelte';
	import AutomationSummary from '$lib/components/new-area/AutomationSummary.svelte';
	import TriggerBtn from '$lib/components/new-area/TriggerBtn.svelte';
	import StringInput from "$lib/components/new-area/Inputs/StringInput.svelte";
	import NumberInput from "$lib/components/new-area/Inputs/NumberInput.svelte";
	import BooleanInput from "$lib/components/new-area/Inputs/BooleanInput.svelte";
	import type { App } from '$lib/types/App';
	import type { Action } from '$lib/types/Action';
	import type { ActionDetails } from '$lib/types/ActionDetails';
	import Success from "$lib/components/new-area/Success.svelte";
	import { setError } from "$lib/store/errorMessage";
	import AvailableVariable from "$lib/components/new-area/AvailableVariable.svelte";

	export let data: PageData;
	let apps: Writable<App[]> = writable([]);
	$: {
		if (data.services) {
			apps.set(data.services);
		}
	}
	const steps = [
		'Choose Trigger App',
		'Select Trigger',
		'Choose Action App',
		'Select Action',
		'Set up Details',
		'Test & Review'
	];
	let currentStep: Writable<number> = writable(0);
	let triggerApp: Writable<App | null> = writable(null);
	let selectedTrigger: Writable<Action | null> = writable(null);
	let actionApp: Writable<App | null> = writable(null);
	let selectedAction: Writable<Action | null> = writable(null);
	let automationName: Writable<string> = writable('');
	let actionDetails: Writable<ActionDetails> = writable({ type: '', params: {} });
	let reactionDetails: Writable<ActionDetails> = writable({ type: '', params: {} });
	let showSuccessAnimation = false;
	let dynamicVariables: Writable<{name: string, type: string, description: string, template: string}[]> = writable([]);

	function validateStep(): boolean {
		let errors: string[] = [];

		switch ($currentStep) {
			case 0:
				if (!$triggerApp) errors.push("Please select a trigger app");
				break;
			case 1:
				if (!$selectedTrigger) errors.push("Please select a trigger");
				break;
			case 2:
				if (!$actionApp) errors.push("Please select an action app");
				break;
			case 3:
				if (!$selectedAction) errors.push("Please select an action");
				break;
			case 4:
				if (!$automationName) errors.push("Automation name is required");
				if ($selectedTrigger) {
					$selectedTrigger.params.forEach(param => {
						if (param.required && !$actionDetails.params[param.name]) {
							errors.push(`Trigger parameter "${param.name}" is required`);
						}
					});
				}
				if ($selectedAction) {
					$selectedAction.params.forEach(param => {
						if (param.required && !$reactionDetails.params[param.name]) {
							errors.push(`Action parameter "${param.name}" is required`);
						}
					});
				}
				break;
		}

		if (errors.length > 0) {
			setError(errors.join('\n'));
			return false;
		}
		return true;
	}

	function nextStep(): void {
		if (validateStep()) {
			currentStep.update((n) => (n < steps.length - 1 ? n + 1 : n));
		}
	}

	function prevStep(): void {
		currentStep.update((n) => (n > 0 ? n - 1 : n));
	}

	function selectApp(app: App, type: 'trigger' | 'action'): void {
		if (type === 'trigger') {
			triggerApp.set(app);
		} else {
			actionApp.set(app);
		}
		nextStep();
	}

	function selectTriggerOrAction(item: Action, type: 'trigger' | 'action'): void {
		if (type === 'trigger') {
			selectedTrigger.set(item);
			actionDetails.set({ type: item.action_type, params: {} });
			item.params.forEach(param => {
				actionDetails.update(details => {
					details.params[param.name] = '';
					return details;
				});
			});
			dynamicVariables.set(item.variables || []);
		} else {
			selectedAction.set(item);
			reactionDetails.set({ type: item.action_type, params: {} });
			item.params.forEach(param => {
				reactionDetails.update(details => {
					details.params[param.name] = '';
					return details;
				});
			});
		}
		nextStep();
	}

	function updateParamValue(store: Writable<ActionDetails>, paramName: string, value: string | number | boolean): void {
		store.update(details => {
			details.params[paramName] = value;
			return details;
		});
	}

	function handleSubmit(event: Event) {
		if (!validateStep()) {
			event.preventDefault();
		}
	}

	function handleCreateAreaResult(result: { type: string; data?: { message: string } }): void {
		if (result.type === 'success') {
			showSuccessAnimation = true;
			setTimeout(() => {
				goto('/dashboard');
			}, 2000);
		} else {
			setError(`Failed to create automation: ${result.data?.message || 'Unknown error'}`);
		}
	}
</script>

<div class="container mx-auto px-4 py-8 flex">
	<div class="flex-1">
		<h1 class="h1 mb-8 text-center">Create New Automation</h1>

		<ProgressBar {steps} currentStep={$currentStep} />
		<MobileIndicator
				currentStep={$currentStep}
				totalSteps={steps.length}
				stepName={steps[$currentStep]}
		/>

		<div class="flex flex-col lg:flex-row gap-4 flex-grow">
			{#if $currentStep === 4 && $dynamicVariables.length > 0}
				<AvailableVariable {dynamicVariables} />
			{/if}
			<div class={ $currentStep >= 4 && $dynamicVariables.length > 0 ? 'w-full lg:w-3/4' : 'w-full' }>
				<div class="card variant-soft p-4 md:p-6 h-full overflow-y-auto">
					{#if showSuccessAnimation}
						<Success/>
					{:else if $currentStep === 0 || $currentStep === 2}
						<h2 class="h2 mb-4 text-center" in:fade>
							Choose {$currentStep === 0 ? 'a Trigger' : 'an Action'} App
						</h2>
						<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
							{#each $apps.filter((app) => ($currentStep === 0 ? app.actions.length > 0 : app.reactions.length > 0)) as app (app._id)}
								<AppCard
										app={{...app, id: app._id, icon: 'mdi:application'}}
										onClick={() => selectApp(app, $currentStep === 0 ? 'trigger' : 'action')}
								/>
							{/each}
						</div>
					{:else if $currentStep === 1 || $currentStep === 3}
						<h2 class="h2 mb-4 text-center" in:fade>
							Select {$currentStep === 1 ? 'Trigger' : 'Action'}
						</h2>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{#each ($currentStep === 1 ? $triggerApp?.actions : $actionApp?.reactions) || [] as item}
								<TriggerBtn
										item={item.name}
										type={$currentStep === 1 ? 'trigger' : 'action'}
										appName={$triggerApp?.name || $actionApp?.name}
										onClick={() => selectTriggerOrAction(item, $currentStep === 1 ? 'trigger' : 'action')}
								/>
							{/each}
						</div>
					{:else if $currentStep === 4}
						<h2 class="h2 mb-4 text-center">Set up Details</h2>
						<div class="mb-4">
							<label for="automation-name" class="label">Automation Name *</label>
							<input
									id="automation-name"
									type="text"
									class="input w-full"
									bind:value={$automationName}
									placeholder="Enter a name for your automation"
							/>
						</div>
						{#if $selectedTrigger}
							<h3 class="h3 mb-2">Trigger Details</h3>
							{#each $selectedTrigger.params as param}
								<div class="mb-4">
									<label for={param.name} class="label">{param.name}{param.required ? ' *' : ''}</label>
									{#if param.type === 'string'}
										<StringInput
												{param}
												required={param.required}
												value={$actionDetails.params[param.name]}
												updateParamValue={(name, value) => updateParamValue(actionDetails, name, value)}
										/>
									{:else if param.type === 'number'}
										<NumberInput
												{param}
												required={param.required}
												value={$actionDetails.params[param.name]}
												updateParamValue={(name, value) => updateParamValue(actionDetails, name, value)}
										/>
									{:else if param.type === 'boolean'}
										<BooleanInput
												{param}
												value={$actionDetails.params[param.name]}
												updateParamValue={(name, value) => updateParamValue(actionDetails, name, value)}
												required={param.required}
										/>
									{/if}
								</div>
							{/each}
						{/if}
						{#if $selectedAction}
							<h3 class="h3 mb-2">Action Details</h3>
							{#each $selectedAction.params as param}
								<div class="mb-4">
									<label for={param.name} class="label">{param.name}{param.required ? ' *' : ''}</label>
									{#if param.type === 'string'}
										<StringInput
												{param}
												required={param.required}
												value={$reactionDetails.params[param.name]}
												updateParamValue={(name, value) => updateParamValue(reactionDetails, name, value)}
										/>
									{:else if param.type === 'number'}
										<NumberInput
												{param}
												required={param.required}
												value={$reactionDetails.params[param.name]}
												updateParamValue={(name, value) => updateParamValue(reactionDetails, name, value)}
										/>
									{:else if param.type === 'boolean'}
										<BooleanInput
												{param}
												required={param.required}
												value={$reactionDetails.params[param.name]}
												updateParamValue={(name, value) => updateParamValue(reactionDetails, name, value)}
										/>
									{/if}
								</div>
							{/each}
						{/if}
						<button class="btn variant-filled-primary w-full" on:click={nextStep}>Continue</button>
					{:else if $currentStep === 5}
						<h2 class="h2 mb-4 text-center">Test & Review</h2>
						<AutomationSummary
								name={$automationName}
								triggerApp={$triggerApp?.name}
								triggerAction={$selectedTrigger?.name}
								actionApp={$actionApp?.name}
								selectedAction={$selectedAction?.name}
						/>
						<form
								method="POST"
								action="?/createArea"
								use:enhance={() => {
								return async ({ result }) => {
									handleCreateAreaResult(result);
								};
							}}
								on:submit={handleSubmit}
						>
							<input type="hidden" name="actionDetails" value={JSON.stringify($actionDetails)} />
							<input type="hidden" name="reactionDetails" value={JSON.stringify($reactionDetails)} />
							<input type="hidden" name="areaName" value={$automationName} />
							<button type="submit" class="btn variant-filled-primary w-full">
								<Icon icon="mdi:flash" class="w-4 h-4 mr-2" />
								Activate Automation
							</button>
						</form>
					{/if}
				</div>
			</div>
		</div>
		<div class="flex justify-between mt-8">
			<button class="btn variant-soft" on:click={prevStep} disabled={$currentStep === 0}>
				<Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" />
				Back
			</button>
			<button class="btn variant-soft" on:click={nextStep} disabled={$currentStep >= steps.length - 1}>
				Next
				<Icon icon="mdi:arrow-right" class="w-4 h-4 ml-2" />
			</button>
		</div>
	</div>
</div>

