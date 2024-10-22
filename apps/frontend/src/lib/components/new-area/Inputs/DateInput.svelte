<script lang="ts">
    import { Calendar } from 'lucide-svelte';

    export let param: any;
    export let value: string = '';
    export let required: boolean = false;
    export let dynamicVariables: Array<{name: string; type: string; description: string; template: string}> = [];
    export let updateParamValue: (name: string, value: string) => void;

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
        }
    }

    $: {
        if (isUsingVariable && selectedVariable) {
            updateParamValue(param.name, `{{${selectedVariable}}}`);
        }
    }
</script>

<div class="relative rounded-lg variant-ghost-primary p-4 flex flex-grow items-center justify-center">
    <div class="flex flex-row items-center mb-2">
        <button
                type="button"
                class="btn-icon variant-soft-primary btn-sm"
                class:variant-filled-primary={isUsingVariable}
                on:click={toggleVariableMode}
                title={isUsingVariable ? "Switch to static date" : "Use dynamic variable"}
        >
            <Calendar class="w-4 h-4" />
        </button>
        {#if dynamicVariables.length > 0}
            <span class="ml-2 text-sm">
                {isUsingVariable ? 'Using variable' : 'Static date'}
            </span>
        {/if}
    </div>

    {#if isUsingVariable}
        <select
                class="select w-full"
                value={selectedVariable}
                on:change={handleVariableSelect}
                {required}
        >
            <option value="">Select a variable</option>
            {#each dynamicVariables as variable}
                {#if variable.type === 'date'}
                    <option value={variable.name}>
                        {variable.name} - {variable.description}
                    </option>
                {/if}
            {/each}
        </select>
    {:else}
        <input
                type="datetime-local"
                class="input w-full"
                value={value}
                on:change={handleDateChange}
                {required}
        />
    {/if}
</div>