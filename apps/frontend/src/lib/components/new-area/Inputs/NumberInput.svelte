<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { Variable, Hash, Calculator } from 'lucide-svelte';

	export let param: { name: string; details: string };
	export let value: number;
	export let updateParamValue: (name: string, value: number | string) => void;
	export let required: boolean;
	export let dynamicVariables: Array<{
		name: string;
		type: string;
		description: string;
		template: string;
	}> = [];
	// Add a prop to determine if this is for an action or reaction
	export let isAction = false;

	let isUsingVariable = false;
	let selectedVariable = '';
	let numberValue = value;

	function handleNumberChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const val = parseFloat(target.value);
		numberValue = val;
		updateParamValue(param.name, val);
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
			updateParamValue(param.name, numberValue || 0);
			selectedVariable = '';
		}
	}

	// Filter only number-compatible variables
	$: numberVariables = dynamicVariables.filter(
		(v) =>
			v.type === 'number' ||
			v.type === 'integer' ||
			v.name.toLowerCase().includes('count') ||
			v.name.toLowerCase().includes('amount')
	);

	// Get the current variable's template if selected
	$: selectedVariableDetails = selectedVariable
		? numberVariables.find((v) => v.name === selectedVariable)
		: null;

	$: {
		if (isUsingVariable && selectedVariable) {
			updateParamValue(param.name, `{{${selectedVariable}}}`);
		}
	}
</script>

{#if isAction}
	<!-- Simple number input for actions -->
	<div class="relative rounded-lg variant-ghost p-4" transition:fade>
		<div class="relative">
			<input
				type="number"
				class="input w-full"
				value={numberValue}
				on:input={handleNumberChange}
				{required}
				placeholder={param.details}
			/>
			<div class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500">
				<Hash class="w-4 h-4" />
			</div>
		</div>
	</div>
{:else}
	<!-- Full featured number input with variable support for reactions -->
	<div class="relative rounded-lg variant-ghost p-4 space-y-2" transition:fade>
		<div class="flex justify-between items-center">
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="btn variant-soft-primary btn-sm"
					class:variant-filled-primary={isUsingVariable}
					on:click={toggleVariableMode}
					title={isUsingVariable ? 'Switch to static number' : 'Use dynamic variable'}
				>
					{#if isUsingVariable}
						<Variable class="w-4 h-4 mr-2" />
						Dynamic
					{:else}
						<Hash class="w-4 h-4 mr-2" />
						Static
					{/if}
				</button>
				{#if numberVariables.length > 0}
					<div class="badge variant-soft" transition:fade>
						{#if isUsingVariable}
							{selectedVariable ? 'Using variable' : 'Select a variable'}
						{:else}
							Enter number
						{/if}
					</div>
				{/if}
			</div>
			{#if isUsingVariable && selectedVariableDetails}
				<div class="badge variant-ghost-secondary">
					<Calculator class="w-4 h-4 mr-1" />
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
						<option value="">Choose a number variable...</option>
						{#each numberVariables as variable}
							<option value={variable.name}>
								{variable.name} - {variable.description}
							</option>
						{/each}
					</select>
					{#if selectedVariable}
						<div class="text-sm variant-ghost p-2 rounded" transition:fade>
							<Calculator class="w-4 h-4 inline-block mr-1" />
							Using dynamic number from trigger
						</div>
					{/if}
				</div>
			{:else}
				<div class="relative">
					<input
						type="number"
						class="input w-full"
						value={numberValue}
						on:input={handleNumberChange}
						{required}
						placeholder={param.details}
					/>
					<div class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500">
						<Hash class="w-4 h-4" />
					</div>
				</div>
			{/if}
		</div>

		{#if isUsingVariable && numberVariables.length > 0 && !selectedVariable}
			<div class="text-sm text-surface-600-300-token mt-2" transition:fade>
				Select a variable to use dynamic number values from your trigger
			</div>
		{/if}
	</div>
{/if}
