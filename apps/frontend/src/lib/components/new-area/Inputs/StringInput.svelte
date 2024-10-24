<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { Variable, Text, MessageSquare } from 'lucide-svelte';

	export let param: { name: string; details: string };
	export let value: string;
	export let updateParamValue: (name: string, value: string) => void;
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
	let textValue = value;

	function handleTextChange(e: Event) {
		const target = e.target as HTMLInputElement;
		textValue = target.value;
		updateParamValue(param.name, target.value);
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
			updateParamValue(param.name, textValue || '');
			selectedVariable = '';
		}
	}

	// Filter only text-compatible variables
	$: textVariables = dynamicVariables.filter(
		(v) =>
			v.type === 'string' || v.type === 'text' || !['boolean', 'number', 'date'].includes(v.type)
	);

	// Get the current variable's template if selected
	$: selectedVariableDetails = selectedVariable
		? textVariables.find((v) => v.name === selectedVariable)
		: null;

	$: {
		if (isUsingVariable && selectedVariable) {
			updateParamValue(param.name, `{{${selectedVariable}}}`);
		}
	}
</script>

{#if isAction}
	<!-- Simple text input for actions -->
	<div class="relative rounded-lg variant-ghost p-4" transition:fade>
		<div class="relative">
			<input
				type="text"
				class="input w-full"
				value={textValue}
				on:input={handleTextChange}
				{required}
				placeholder={param.details}
			/>
			<div class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500">
				<Text class="w-4 h-4" />
			</div>
		</div>
	</div>
{:else}
	<!-- Full featured text input with variable support for reactions -->
	<div class="relative rounded-lg variant-ghost p-4 space-y-2" transition:fade>
		<div class="flex justify-between items-center">
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="btn variant-soft-primary btn-sm"
					class:variant-filled-primary={isUsingVariable}
					on:click={toggleVariableMode}
					title={isUsingVariable ? 'Switch to static text' : 'Use dynamic variable'}
				>
					{#if isUsingVariable}
						<Variable class="w-4 h-4 mr-2" />
						Dynamic
					{:else}
						<Text class="w-4 h-4 mr-2" />
						Static
					{/if}
				</button>
				{#if textVariables.length > 0}
					<div class="badge variant-soft" transition:fade>
						{#if isUsingVariable}
							{selectedVariable ? 'Using variable' : 'Select a variable'}
						{:else}
							Enter text
						{/if}
					</div>
				{/if}
			</div>
			{#if isUsingVariable && selectedVariableDetails}
				<div class="badge variant-ghost-secondary">
					<MessageSquare class="w-4 h-4 mr-1" />
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
						<option value="">Choose a text variable...</option>
						{#each textVariables as variable}
							<option value={variable.name}>
								{variable.name} - {variable.description}
							</option>
						{/each}
					</select>
					{#if selectedVariable}
						<div class="text-sm variant-ghost p-2 rounded" transition:fade>
							<MessageSquare class="w-4 h-4 inline-block mr-1" />
							Using dynamic text from trigger
						</div>
					{/if}
				</div>
			{:else}
				<div class="relative">
					<input
						type="text"
						class="input w-full"
						value={textValue}
						on:input={handleTextChange}
						{required}
						placeholder={param.details}
					/>
					<div class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500">
						<Text class="w-4 h-4" />
					</div>
				</div>
			{/if}
		</div>

		{#if isUsingVariable && textVariables.length > 0 && !selectedVariable}
			<div class="text-sm text-surface-600-300-token mt-2" transition:fade>
				Select a variable to use dynamic text values from your trigger
			</div>
		{/if}
	</div>
{/if}
