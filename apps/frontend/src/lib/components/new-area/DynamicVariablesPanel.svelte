<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let dynamicVariables: string[] = [];
    export let addVariable: (variable: string) => void;
    export let removeVariable: (variable: string) => void;

    let newVariable = '';

    function handleAddVariable() {
        if (newVariable && !dynamicVariables.includes(`{{${newVariable}}}`)) {
            addVariable(`{{${newVariable}}}`);
            newVariable = '';
        }
    }

    function handleRemoveVariable(variable: string) {
        removeVariable(variable);
    }
</script>

<div class="card variant-soft p-4 w-64">
    <h3 class="h3 mb-4">Dynamic Variables</h3>
    <div class="mb-4">
        <input
                type="text"
                class="input w-full mb-2"
                bind:value={newVariable}
                placeholder="Enter variable name"
        />
        <button class="btn variant-filled-secondary w-full" on:click={handleAddVariable}>
            Add Variable
        </button>
    </div>
    <ul class="list-disc list-inside">
        {#each dynamicVariables as variable}
            <li class="mb-2 flex items-center justify-between">
                <span>{variable}</span>
                <button
                        class="btn btn-sm variant-ghost-error"
                        on:click={() => handleRemoveVariable(variable)}
                >
                    Remove
                </button>
            </li>
        {/each}
    </ul>
</div>