<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { writable, type Writable } from 'svelte/store';
	import Icon from '@iconify/svelte';
	import { areaStore } from '$lib/store/areaStore';
	import { getIconForApp } from '$lib/utils/getIconName';
	import StringInput from '$lib/components/new-area/Inputs/StringInput.svelte';
	import NumberInput from '$lib/components/new-area/Inputs/NumberInput.svelte';
	import BooleanInput from '$lib/components/new-area/Inputs/BooleanInput.svelte';
	import DateInput from '$lib/components/new-area/Inputs/DateInput.svelte';
	import Select from '$lib/components/new-area/Inputs/Select.svelte';
	import TextInput from '$lib/components/new-area/Inputs/TextInput.svelte';
	import AvailableVariable from '$lib/components/new-area/AvailableVariable.svelte';
	import type { ActionVariable } from '@area/shared';

	let automationName = '';
	let actionErrors: string[] = [];
	let reactionErrors: string[] = [];
	const dynamicVariablesStore: Writable<ActionVariable[]> = writable([]);

	onMount(() => {
		if (
			!$areaStore.triggerApp ||
			!$areaStore.selectedTrigger ||
			!$areaStore.actionApp ||
			!$areaStore.selectedAction
		) {
			goto('/dashboard/new-area/action-selection');
			return;
		}
		const variables = $areaStore.selectedTrigger?.variables || [];
		dynamicVariablesStore.set(variables);
	});

	function validateForm(): boolean {
		actionErrors = [];
		reactionErrors = [];

		if (!automationName.trim()) {
			actionErrors.push('Automation name is required');
		}
		$areaStore.selectedTrigger?.params.forEach((param) => {
			if (param.required && !$areaStore.actionDetails?.params[param.name]) {
				actionErrors.push(`${param.name} is required`);
			}
		});
		$areaStore.selectedAction?.params.forEach((param) => {
			if (param.required && !$areaStore.reactionDetails?.params[param.name]) {
				reactionErrors.push(`${param.name} is required`);
			}
		});
		return actionErrors.length === 0 && reactionErrors.length === 0;
	}

	async function handleContinue(): Promise<void> {
		if (validateForm()) {
			areaStore.setAutomationName(automationName);
			if (browser) {
				await goto('/dashboard/new-area/review');
			}
		}
	}
	function handleUpdateActionParam(name: string, value: string | number | boolean): void {
		areaStore.updateActionParam(name, value);
	}

	function handleUpdateReactionParam(name: string, value: string | number | boolean): void {
		areaStore.updateReactionParam(name, value);
	}

	// Reactive declarations
	$: triggerApp = $areaStore.triggerApp;
	$: selectedTrigger = $areaStore.selectedTrigger;
	$: actionApp = $areaStore.actionApp;
	$: selectedAction = $areaStore.selectedAction;
	$: actionDetails = $areaStore.actionDetails;
	$: reactionDetails = $areaStore.reactionDetails;

	// Update variables store when trigger changes
	$: if (selectedTrigger?.variables) {
		dynamicVariablesStore.set(selectedTrigger.variables);
	}
</script>

<div class="space-y-6" in:fade>
	<!-- Workflow Summary -->
	<div class="card variant-soft p-4">
		<div class="flex items-center gap-4 flex-wrap">
			<!-- Trigger Info -->
			<div class="flex items-center gap-2">
				<div class="w-10 h-10 rounded-full variant-filled-surface flex items-center justify-center">
					<Icon icon={getIconForApp($areaStore.triggerApp?.name || '')} class="w-6 h-6" />
				</div>
				<div class="text-sm">
					<p class="font-medium">{$areaStore.triggerApp?.name}</p>
					<p class="opacity-80">{$areaStore.selectedTrigger?.name}</p>
				</div>
			</div>

			<Icon icon="mdi:arrow-right" class="w-5 h-5" />

			<!-- Action Info -->
			<div class="flex items-center gap-2">
				<div class="w-10 h-10 rounded-full variant-filled-surface flex items-center justify-center">
					<Icon icon={getIconForApp($areaStore.actionApp?.name || '')} class="w-6 h-6" />
				</div>
				<div class="text-sm">
					<p class="font-medium">{$areaStore.actionApp?.name}</p>
					<p class="opacity-80">{$areaStore.selectedAction?.name}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-col lg:flex-row gap-6">
		<!-- Variables Panel -->
		{#if $dynamicVariablesStore.length > 0}
			<AvailableVariable dynamicVariables={dynamicVariablesStore} />
		{/if}

		<!-- Configuration Form -->
		<div class="flex-1">
			<!-- Automation Name -->
			<div class="card variant-ghost p-4 mb-6">
				<label for="automation-name" class="label h3">Automation Name *</label>
				<input
					id="automation-name"
					type="text"
					class="input w-full"
					bind:value={automationName}
					placeholder="e.g., New YouTube video to Discord notification"
				/>
				{#if actionErrors.includes('Automation name is required')}
					<p class="text-error-500 text-sm mt-1">Automation name is required</p>
				{/if}
			</div>

			<!-- Trigger Configuration -->
			<div class="card variant-ghost p-4 mb-6">
				<h3 class="h3 mb-4">Trigger Configuration</h3>
				{#if $areaStore.selectedTrigger?.params}
					{#each $areaStore.selectedTrigger.params as param}
						<div class="mb-4">
							<label class="label">{param.name} {param.required ? '*' : ''}</label>
							{#if param.type === 'string'}
								<StringInput
									{param}
									value={$areaStore.actionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateActionParam(name, value)}
									required={param.required}
									isAction={true}
								/>
							{:else if param.type === 'number'}
								<NumberInput
									{param}
									value={$areaStore.actionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateActionParam(name, value)}
									required={param.required}
									isAction={true}
								/>
							{:else if param.type === 'boolean'}
								<BooleanInput
									{param}
									value={$areaStore.actionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateActionParam(name, value)}
									required={param.required}
								/>
							{:else if param.type === 'date'}
								<DateInput
									{param}
									value={$areaStore.actionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateActionParam(name, value)}
									required={param.required}
								/>
							{:else if param.type === 'text'}
								<TextInput
									{param}
									value={$areaStore.actionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateActionParam(name, value)}
									required={param.required}
								/>
							{:else if param.type === 'enum'}
								<Select
									options={param.items || []}
									value={$areaStore.actionDetails?.params[param.name]}
									on:change={(e) => areaStore.updateActionParam(param.name, e.detail)}
									required={param.required}
								/>
							{/if}
							{#if actionErrors.includes(`${param.name} is required`)}
								<p class="text-error-500 text-sm mt-1">{param.name} is required</p>
							{/if}
						</div>
					{/each}
				{/if}
			</div>

			<!-- Action Configuration -->
			<div class="card variant-ghost p-4 mb-6">
				<h3 class="h3 mb-4">Action Configuration</h3>
				{#if $areaStore.selectedAction?.params}
					{#each $areaStore.selectedAction.params as param}
						<div class="mb-4">
							<label class="label">{param.name} {param.required ? '*' : ''}</label>
							{#if param.type === 'string'}
								<StringInput
									{param}
									value={$areaStore.reactionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateReactionParam(name, value)}
									required={param.required}
									dynamicVariables={$dynamicVariablesStore}
									isAction={false}
								/>
							{:else if param.type === 'number'}
								<NumberInput
									{param}
									value={$areaStore.reactionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateReactionParam(name, value)}
									required={param.required}
									dynamicVariables={$dynamicVariablesStore}
									isAction={false}
								/>
							{:else if param.type === 'boolean'}
								<BooleanInput
									{param}
									value={$areaStore.reactionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateReactionParam(name, value)}
									required={param.required}
									dynamicVariables={$dynamicVariablesStore}
								/>
							{:else if param.type === 'date'}
								<DateInput
									{param}
									value={$areaStore.reactionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateReactionParam(name, value)}
									required={param.required}
									dynamicVariables={$dynamicVariablesStore}
								/>
							{:else if param.type === 'text'}
								<TextInput
									{param}
									value={$areaStore.reactionDetails?.params[param.name]}
									updateParamValue={(name, value) => handleUpdateReactionParam(name, value)}
									required={param.required}
									dynamicVariables={$dynamicVariablesStore}
								/>
							{:else if param.type === 'enum'}
								<Select
									options={param.items || []}
									value={$areaStore.reactionDetails?.params[param.name]}
									on:change={(e) => areaStore.updateReactionParam(param.name, e.detail)}
									required={param.required}
									dynamicVariables={$dynamicVariablesStore}
								/>
							{/if}
							{#if reactionErrors.includes(`${param.name} is required`)}
								<p class="text-error-500 text-sm mt-1">{param.name} is required</p>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	<!-- Navigation -->
	<div class="flex justify-between mt-8">
		<a href="/dashboard/new-area/action-selection" class="btn variant-soft">
			<Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" />
			Back
		</a>
		<button class="btn variant-filled-primary" on:click={handleContinue}>
			Review Configuration
			<Icon icon="mdi:arrow-right" class="w-4 h-4 ml-2" />
		</button>
	</div>

	<!-- Help Tooltip -->
	<div class="card variant-ghost p-4">
		<div class="flex items-start gap-4">
			<Icon icon="mdi:lightbulb-on" class="w-6 h-6 text-warning-500" />
			<div class="text-sm">
				<strong>Configuring Your Automation</strong>
				<p>
					Set up the details for both your trigger and action. You can use variables from your
					trigger in the action configuration by clicking the "Dynamic" button.
				</p>
				{#if $dynamicVariablesStore.length > 0}
					<p class="mt-2">
						Available variables are shown in the panel on the left. Use them to make your automation
						more dynamic!
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>
