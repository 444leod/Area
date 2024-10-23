```svelte
<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import { Variable, ListFilter, Check } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';

    export let options: string[];
    export let value: string = '';
    export let required: boolean = false;
    export let dynamicVariables: Array<{name: string; type: string; description: string; template: string}> = [];
    export let isAction = false;

    const dispatch = createEventDispatcher();

    let isUsingVariable = false;
    let selectedVariable = '';
    let selectValue = value;

    function handleSelectChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        selectValue = target.value;
        dispatch('change', target.value);
    }

    function handleVariableSelect(e: Event) {
        const target = e.target as HTMLSelectElement;
        selectedVariable = target.value;
        if (target.value) {
            dispatch('change', `{{${target.value}}}`);
        }
    }

    function toggleVariableMode() {
        isUsingVariable = !isUsingVariable;
        if (!isUsingVariable) {
            dispatch('change', selectValue);
            selectedVariable = '';
        }
    }

    // Filter variables that could represent a selection
    $: selectVariables = dynamicVariables.filter(v =>
        v.type === 'string' ||
        v.type === 'enum' ||
        v.template?.toLowerCase().includes(options[0]?.toLowerCase() || '')
    );

    // Get the current variable's template if selected
    $: selectedVariableDetails = selectedVariable ?
        selectVariables.find(v => v.name === selectedVariable) : null;
</script>

{#if isAction}
    <!-- Simple select for actions -->
    <div class="relative rounded-lg variant-ghost p-4" transition:fade>
        <div class="relative">
            <select
                    class="select w-full"
                    {required}
                    value={selectValue}
                    on:change={handleSelectChange}
            >
                <option value="" disabled selected>Select an option</option>
                {#each options as option}
                    <option value={option}>{option}</option>
                {/each}
            </select>
            <div class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
                <ListFilter class="w-4 h-4" />
            </div>
        </div>
    </div>
{:else}
    <!-- Full featured select with variable support for reactions -->
    <div class="relative rounded-lg variant-ghost p-4 space-y-2" transition:fade>
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
                <button
                        type="button"
                        class="btn variant-soft-primary btn-sm"
                        class:variant-filled-primary={isUsingVariable}
                        on:click={toggleVariableMode}
                        title={isUsingVariable ? "Switch to static selection" : "Use dynamic variable"}
                >
                    {#if isUsingVariable}
                        <Variable class="w-4 h-4 mr-2" />
                        Dynamic
                    {:else}
                        <ListFilter class="w-4 h-4 mr-2" />
                        Static
                    {/if}
                </button>
                {#if selectVariables.length > 0}
                    <div class="badge variant-soft" transition:fade>
                        {#if isUsingVariable}
                            {selectedVariable ? 'Using variable' : 'Select a variable'}
                        {:else}
                            Choose option
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
                        <option value="">Choose a variable...</option>
                        {#each selectVariables as variable}
                            <option value={variable.name}>
                                {variable.name} - {variable.description}
                            </option>
                        {/each}
                    </select>
                    {#if selectedVariable}
                        <div class="text-sm variant-ghost p-2 rounded" transition:fade>
                            <ListFilter class="w-4 h-4 inline-block mr-1" />
                            Using dynamic selection from trigger
                        </div>
                    {/if}
                </div>
            {:else}
                <div class="relative">
                    <select
                            class="select w-full"
                            {required}
                            value={selectValue}
                            on:change={handleSelectChange}
                    >
                        <option value="" disabled selected>Select an option</option>
                        {#each options as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                    <div class="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
                        <ListFilter class="w-4 h-4" />
                    </div>
                </div>
            {/if}
        </div>

        {#if isUsingVariable && selectVariables.length > 0 && !selectedVariable}
            <div class="text-sm text-surface-600-300-token mt-2" transition:fade>
                Select a variable to use dynamic values from your trigger
            </div>
        {/if}
    </div>
{/if}

<style>
    .select {
        background-color: rgb(var(--color-surface-50));
        padding-right: 2.5rem;
    }
</style>
```