<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { Variable, ToggleLeft, Check } from 'lucide-svelte';

	export let param: { name: string };
	export let value: boolean;
	export let updateParamValue: (name: string, value: boolean | string) => void;
	export let required: boolean;
	export let dynamicVariables: Array<{
		name: string;
		type: string;
		description: string;
		template: string;
	}> = [];
	export let isAction = false;

	let isUsingVariable = false;
	let selectedVariable = '';
	let boolValue = value;

	function handleBooleanChange(e: Event) {
		const target = e.target as HTMLInputElement;
		boolValue = target.checked;
		updateParamValue(param.name, target.checked);
	}

	function handleVariableSelect(e: Event) {
		const target = e.target as HTMLSelectElement;
		selectedVariable = target.value;
		if (target.value) {
			updateParamValue(param.name, `{{${target.value}}}`);
		}
	}

	function toggleVariableMode() {
		isUsingVariable = !isUsingVariable;
		if (!isUsingVariable) {
			updateParamValue(param.name, boolValue);
			selectedVariable = '';
		}
	}

	// Filter only boolean-compatible variables
	$: booleanVariables = dynamicVariables.filter(
		(v) =>
			v.type === 'boolean' ||
			v.name.toLowerCase().includes('is_') ||
			v.name.toLowerCase().includes('has_')
	);

	// Get the current variable's template if selected
	$: selectedVariableDetails = selectedVariable
		? booleanVariables.find((v) => v.name === selectedVariable)
		: null;

	$: {
		if (isUsingVariable && selectedVariable) {
			updateParamValue(param.name, `{{${selectedVariable}}}`);
		}
	}
</script>

{#if isAction}
	<!-- Simple boolean input for actions -->
	<div class="relative rounded-lg variant-ghost p-4" transition:fade>
		<label class="flex items-center justify-between space-x-2">
			<span class="flex items-center">
				<ToggleLeft class="w-4 h-4 mr-2 text-surface-500" />
				{param.name}
			</span>
			<div class="flex items-center">
				<input
					type="checkbox"
					class="checkbox"
					checked={boolValue}
					on:change={handleBooleanChange}
					{required}
				/>
			</div>
		</label>
	</div>
{:else}
	<!-- Full featured boolean input with variable support for reactions -->
	<div class="relative rounded-lg variant-ghost p-4 space-y-2" transition:fade>
		<div class="flex justify-between items-center">
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="btn variant-soft-primary btn-sm"
					class:variant-filled-primary={isUsingVariable}
					on:click={toggleVariableMode}
					title={isUsingVariable ? 'Switch to static boolean' : 'Use dynamic variable'}
				>
					{#if isUsingVariable}
						<Variable class="w-4 h-4 mr-2" />
						Dynamic
					{:else}
						<ToggleLeft class="w-4 h-4 mr-2" />
						Static
					{/if}
				</button>
				{#if booleanVariables.length > 0}
					<div class="badge variant-soft" transition:fade>
						{#if isUsingVariable}
							{selectedVariable ? 'Using variable' : 'Select a variable'}
						{:else}
							Toggle value
						{/if}
					</div>
				{/if}
			</div>
			{#if isUsingVariable && selectedVariableDetails}
				<div class="badge variant-ghost-secondary">
					<Check class="w-4 h-4 mr-1" />
					Example: {selectedVariableDetails.template}
				</div>
			{/if}
		</div>

		<div class="mt-2" transition:slide>
			{#if isUsingVariable}
				<div class="space-y-2">
					<select
						class="select w-full"
						value={selectedVariable}
						on:change={handleVariableSelect}
						{required}
					>
						<option value="">Choose a boolean variable...</option>
						{#each booleanVariables as variable}
							<option value={variable.name}>
								{variable.name} - {variable.description}
							</option>
						{/each}
					</select>
					{#if selectedVariable}
						<div class="text-sm variant-ghost p-2 rounded" transition:fade>
							<Check class="w-4 h-4 inline-block mr-1" />
							Using dynamic boolean from trigger
						</div>
					{/if}
				</div>
			{:else}
				<label class="flex items-center justify-between space-x-2 p-2">
					<span>{param.name}</span>
					<input
						type="checkbox"
						class="checkbox"
						checked={boolValue}
						on:change={handleBooleanChange}
						{required}
					/>
				</label>
			{/if}
		</div>

		{#if isUsingVariable && booleanVariables.length > 0 && !selectedVariable}
			<div class="text-sm text-surface-600-300-token mt-2" transition:fade>
				Select a variable to use dynamic boolean values from your trigger
			</div>
		{/if}
	</div>
{/if}

<style>
	.select {
		background-color: white;
		background-color: rgb(var(--color-surface-50));
	}

	/* Custom checkbox styles if needed */
	.checkbox {
		transform: scale(1.2);
	}
</style>
