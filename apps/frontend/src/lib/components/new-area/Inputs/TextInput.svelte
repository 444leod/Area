<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { Variable, AlignLeft, MessageSquare } from 'lucide-svelte';

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
	export let isAction = false;

	let isUsingVariable = false;
	let selectedVariable = '';
	let textValue = value || '';

	function handleTextareaChange(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		textValue = target.value;
		updateParamValue(param.name, target.value);
	}

	function insertVariable(variable: string) {
		const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
		const cursorPosition = textarea?.selectionStart || textValue.length;
		const newValue =
			textValue.slice(0, cursorPosition) + `{{${variable}}}` + textValue.slice(cursorPosition);
		textValue = newValue;
		updateParamValue(param.name, newValue);
		textarea?.focus();
	}

	// Filter variables to show only text-compatible ones
	$: textVariables = dynamicVariables.filter(
		(v) => v.type === 'string' || v.type === 'text' || !['boolean', 'number'].includes(v.type)
	);

	// Update the value when it changes externally
	$: {
		if (value !== undefined && value !== null && !String(value).includes('{{')) {
			textValue = value;
		}
	}
</script>

{#if isAction}
	<!-- Simple textarea for actions -->
	<div class="relative rounded-lg variant-ghost p-4 space-y-2" transition:fade>
		<div class="flex items-center gap-2 mb-2">
			<AlignLeft class="w-4 h-4 text-surface-500" />
			<span class="text-sm">Text Input</span>
		</div>
		<textarea
			class="textarea w-full h-32 font-mono text-sm"
			{required}
			value={textValue}
			on:input={handleTextareaChange}
			placeholder={param.details || 'Enter your text here...'}
		></textarea>
	</div>
{:else}
	<!-- Full featured textarea with variable support for reactions -->
	<div class="relative rounded-lg variant-ghost p-4 space-y-2" transition:fade>
		<div class="flex justify-between items-center mb-2">
			<div class="flex items-center gap-2">
				<AlignLeft class="w-4 h-4 text-surface-500" />
				<span class="text-sm font-medium">Text Input with Variables</span>
			</div>
			{#if textVariables.length > 0}
				<div class="badge variant-ghost-secondary">
					<Variable class="w-4 h-4 mr-1" />
					{textVariables.length} variables available
				</div>
			{/if}
		</div>

		<div class="flex flex-col gap-2" transition:slide>
			{#if textVariables.length > 0}
				<div class="flex items-center gap-2">
					<select
						class="select flex-1"
						value={selectedVariable}
						on:change={(e) => {
							if (e.target.value) {
								insertVariable(e.target.value);
								e.target.value = '';
							}
						}}
					>
						<option value="">Insert a variable at cursor position...</option>
						{#each textVariables as variable}
							<option value={variable.name}>
								{variable.name} - {variable.description}
							</option>
						{/each}
					</select>
				</div>
			{/if}

			<div class="relative">
				<textarea
					class="textarea w-full h-32 font-mono text-sm"
					{required}
					value={textValue}
					on:input={handleTextareaChange}
					placeholder={param.details ||
						'Enter your text here. You can use variables like {{variableName}}'}
				></textarea>
			</div>

			{#if textVariables.length > 0}
				<div class="text-xs text-surface-600-300-token bg-surface-100-800-token p-2 rounded">
					<MessageSquare class="w-4 h-4 inline-block mr-1" />
					Tip: Use the dropdown above to insert variables, or type them manually using the format
					<code class="bg-surface-200-700-token p-1 rounded">{'{{'}variableName{'}}'}</code>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	textarea {
		resize: vertical;
		min-height: 8rem;
		line-height: 1.4;
		tab-size: 4;
	}

	textarea::-webkit-scrollbar {
		width: 8px;
	}

	textarea::-webkit-scrollbar-track {
		background: var(--color-surface-200);
		border-radius: 4px;
	}

	textarea::-webkit-scrollbar-thumb {
		background: var(--color-surface-400);
		border-radius: 4px;
	}

	textarea::-webkit-scrollbar-thumb:hover {
		background: var(--color-surface-500);
	}

	.select {
		background-color: rgb(var(--color-surface-50));
	}
</style>
