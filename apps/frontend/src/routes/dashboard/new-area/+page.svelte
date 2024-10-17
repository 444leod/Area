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

	function nextStep(): void {
		currentStep.update((n) => (n < steps.length - 1 ? n + 1 : n));
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
			actionDetails.set({ type: item.ActionType, params: {} });
			item.params.forEach(param => {
				actionDetails.update(details => {
					details.params[param.name] = '';
					return details;
				});
			});
		} else {
			selectedAction.set(item);
			reactionDetails.set({ type: item.ActionType, params: {} });
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

	let formMessage = '';
	let showSuccessAnimation = false;

	function handleCreateAreaResult(result: { type: string; data?: { message: string } }): void {
		if (result.type === 'success') {
			showSuccessAnimation = true;
			formMessage = 'Automation created successfully!';
			setTimeout(() => {
				goto('/dashboard');
			}, 2000);
		} else {
			formMessage = `Failed to create automation: ${result.data?.message || 'Unknown error'}`;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="h1 mb-8 text-center">Create New Automation</h1>

	<ProgressBar {steps} currentStep={$currentStep} />
	<MobileIndicator
			currentStep={$currentStep}
			totalSteps={steps.length}
			stepName={steps[$currentStep]}
	/>

	<div class="card variant-soft p-4 md:p-6">
		{#if showSuccessAnimation}
			<div class="flex flex-col items-center justify-center h-64" in:fly={{ y: 50, duration: 500 }}>
				<Icon icon="mdi:check-circle" class="w-24 h-24 text-success mb-4" />
				<h2 class="h2 text-center text-success">Automation Created Successfully!</h2>
				<p class="mt-2">Redirecting to Dashboard...</p>
			</div>
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
				<label for="automation-name" class="label">Automation Name</label>
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
						<label for={param.name} class="label">{param.name}</label>
						{#if param.type === 'string'}
							<StringInput
									param={param}
									value={$actionDetails.params[param.name]}
									updateParamValue={(name, value) => updateParamValue(actionDetails, name, value)}
							/>
						{:else if param.type === 'number'}
							<NumberInput
									param={param}
									value={$actionDetails.params[param.name]}
									updateParamValue={(name, value) => updateParamValue(actionDetails, name, value)}
							/>
						{:else if param.type === 'boolean'}
							<BooleanInput
									param={param}
									value={$actionDetails.params[param.name]}
									updateParamValue={(name, value) => updateParamValue(actionDetails, name, value)}
							/>
						{/if}
					</div>
				{/each}
			{/if}
			{#if $selectedAction}
				<h3 class="h3 mb-2">Action Details</h3>
				{#each $selectedAction.params as param}
					<div class="mb-4">
						<label for={param.name} class="label">{param.name}</label>
						{#if param.type === 'string'}
							<StringInput
									param={param}
									value={$reactionDetails.params[param.name]}
									updateParamValue={(name, value) => updateParamValue(reactionDetails, name, value)}
							/>
						{:else if param.type === 'number'}
							<NumberInput
									param={param}
									value={$reactionDetails.params[param.name]}
									updateParamValue={(name, value) => updateParamValue(reactionDetails, name, value)}
							/>
						{:else if param.type === 'boolean'}
							<BooleanInput
									param={param}
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
			>
				<input type="hidden" name="actionDetails" value={JSON.stringify($actionDetails)} />
				<input type="hidden" name="reactionDetails" value={JSON.stringify($reactionDetails)} />
				<button type="submit" class="btn variant-filled-primary w-full">
					<Icon icon="mdi:flash" class="w-4 h-4 mr-2" />
					Activate Automation
				</button>
			</form>
			{#if formMessage}
				<p class="mt-4 text-center" class:text-error={formMessage.includes('Failed')}>
					{formMessage}
				</p>
			{/if}
		{/if}
	</div>

	<div class="flex justify-between mt-8">
		<button
				class="btn variant-soft"
				on:click={prevStep}
				disabled={$currentStep === 0 || showSuccessAnimation}
		>
			Back
		</button>
		{#if $currentStep < steps.length - 1 && $currentStep !== 1 && $currentStep !== 3}
			<button class="btn variant-filled-primary" on:click={nextStep} disabled={showSuccessAnimation}>
				Next
			</button>
		{/if}
	</div>
</div>