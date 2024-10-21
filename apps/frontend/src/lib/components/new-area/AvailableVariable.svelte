<script lang="ts">
    import { slide } from 'svelte/transition';
    import { ChevronDown, ChevronUp, Axe, Copy } from 'lucide-svelte';
    import type { Writable } from 'svelte/store';

    export let dynamicVariables: Writable<{name: string; type: string; description: string; template: string}[]>;

    let isOpen = false;
    let expandedVariable: string | null = null;

    function toggleVariable(name: string) {
        expandedVariable = expandedVariable === name ? null : name;
    }

    function copyToClipboard(variableName: string) {
        const textToCopy = `{{${variableName}}}`;
        navigator.clipboard.writeText(textToCopy);
    }
</script>

<div class="w-full lg:w-1/4 mb-4 lg:mb-0 flex flex-col">
    <div class="card variant-soft p-4 flex-grow flex flex-col">
        <button
                on:click={() => isOpen = !isOpen}
                class="flex items-center justify-between w-full text-left lg:cursor-default"
        >
            <h3 class="h3 text-primary-500 flex items-center">
                <Axe class="w-5 h-5 mr-2" />
                Available Variables
            </h3>
            <div class="lg:hidden">
                {#if isOpen}
                    <ChevronUp class="w-5 h-5" />
                {:else}
                    <ChevronDown class="w-5 h-5" />
                {/if}
            </div>
        </button>

        <div class="mt-4 lg:block flex-grow overflow-y-auto" class:hidden={!isOpen} transition:slide|local>
            <p class="mb-4 text-sm">You can use these variables in your reaction:</p>
            <ul class="space-y-2">
                {#each $dynamicVariables as variable}
                    <li class="border border-surface-300-600-token rounded-lg overflow-hidden">
                        <button
                                on:click={() => toggleVariable(variable.name)}
                                class="w-full p-2 flex justify-between items-center hover:bg-primary-500 hover:bg-opacity-10 transition-colors duration-200"
                        >
                            <span class="font-semibold text-primary-700">{"{{"}{variable.name}{"}}"}</span>
                            <div>
                                {#if expandedVariable === variable.name}
                                    <ChevronUp class="w-4 h-4" />
                                {:else}
                                    <ChevronDown class="w-4 h-4" />
                                {/if}
                            </div>
                        </button>
                        {#if expandedVariable === variable.name}
                            <div class="p-2 bg-surface-100-800-token">
                                <p class="text-sm text-secondary-700">{variable.description}</p>
                                <div class="mt-2 flex items-center justify-between bg-surface-200-700-token p-2 rounded">
                                    <code class="text-xs text-tertiary-700">{variable.template || 'N/A'}</code>
                                    <button
                                            on:click={() => copyToClipboard(variable.template)}
                                            class="text-primary-500 hover:text-primary-700"
                                    >
                                        <Copy class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </li>
                {/each}
            </ul>
            <p class="mt-4 text-sm font-medium">Use variables like this: <code class="bg-surface-200-700-token p-1 rounded">{'{{variableName}}'}</code></p>
        </div>
    </div>
</div>