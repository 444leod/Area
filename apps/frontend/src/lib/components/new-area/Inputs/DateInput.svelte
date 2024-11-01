<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { Calendar, Variable, Clock, CalendarClock } from 'lucide-svelte';

	export let param: any;
	export let value: string = '';
	export let required: boolean = false;
	export let dynamicVariables: Array<{
		name: string;
		type: string;
		description: string;
		template: string;
	}> = [];
	export let updateParamValue: (name: string, value: string) => void;
	export let isAction = false; // Ajout du prop isAction

	let isUsingVariable = false;
	let selectedVariable = '';

	function handleDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		updateParamValue(param.name, target.value);
	}

	function handleVariableSelect(e: Event) {
		const target = e.target as HTMLSelectElement;
		selectedVariable = target.value;
		updateParamValue(param.name, `{{${target.value}}}`);
	}

	function toggleVariableMode() {
		isUsingVariable = !isUsingVariable;
		if (!isUsingVariable) {
			updateParamValue(param.name, '');
			selectedVariable = '';
		}
	}

	$: dateVariables = dynamicVariables.filter(
		(v) =>
			v.type === 'date' ||
			v.name.toLowerCase().includes('date') ||
			v.name.toLowerCase().includes('time')
	);

	$: selectedVariableDetails = selectedVariable
		? dateVariables.find((v) => v.name === selectedVariable)
		: null;

	$: if (isUsingVariable && selectedVariable && value !== `{{${selectedVariable}}}`) {
		updateParamValue(param.name, `{{${selectedVariable}}}`);
	}
</script>

{#if isAction}
	<!-- Simple date input for actions -->
	<div class="relative rounded-lg variant-ghost p-4" transition:fade>
		<div class="flex items-center gap-2 mb-2">
			<Calendar class="w-4 h-4 text-surface-500" />
			<span class="text-sm">Date & Time</span>
		</div>
		<div class="relative">
			<input
				type="datetime-local"
				class="input w-full"
				{value}
				on:change={handleDateChange}
				{required}
			/>
			<div class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500">
				<Calendar class="w-4 h-4" />
			</div>
		</div>
	</div>
{:else}
	<!-- Full featured date input with variable support for reactions -->
	<div class="relative rounded-lg variant-ghost p-4 space-y-2" transition:fade>
		<div class="flex justify-between items-center">
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="btn variant-soft-primary btn-sm"
					class:variant-filled-primary={isUsingVariable}
					on:click={toggleVariableMode}
					title={isUsingVariable ? 'Switch to static date' : 'Use dynamic variable'}
				>
					{#if isUsingVariable}
						<Variable class="w-4 h-4 mr-2" />
						Dynamic
					{:else}
						<Calendar class="w-4 h-4 mr-2" />
						Static
					{/if}
				</button>
				{#if dateVariables.length > 0}
					<div class="badge variant-soft" transition:fade>
						{#if isUsingVariable}
							{selectedVariable ? 'Using variable' : 'Select a variable'}
						{:else}
							Select date & time
						{/if}
					</div>
				{/if}
			</div>
			{#if isUsingVariable && selectedVariableDetails}
				<div class="badge variant-ghost-secondary">
					<Clock class="w-4 h-4 mr-1" />
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
						<option value="">Choose a date/time variable...</option>
						{#each dateVariables as variable}
							<option value={variable.name}>
								{variable.name} - {variable.description}
							</option>
						{/each}
					</select>
					{#if selectedVariable}
						<div class="text-sm variant-ghost p-2 rounded" transition:fade>
							<CalendarClock class="w-4 h-4 inline-block mr-1" />
							Using dynamic date/time from trigger
						</div>
					{/if}
				</div>
			{:else}
				<div class="relative">
					<input
						type="datetime-local"
						class="input w-full"
						{value}
						on:change={handleDateChange}
						{required}
					/>
					<div class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500">
						<Calendar class="w-4 h-4" />
					</div>
				</div>
			{/if}
		</div>

		{#if isUsingVariable && dateVariables.length > 0 && !selectedVariable}
			<div class="text-sm text-surface-600-300-token mt-2" transition:fade>
				Select a variable to use dynamic date/time values from your trigger
			</div>
		{/if}
	</div>
{/if}
