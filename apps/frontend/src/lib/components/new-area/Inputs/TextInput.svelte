<script lang="ts">
    export let param: any;
    export let value: string = '';
    export let required: boolean = false;
    export let dynamicVariables: Array<{name: string; type: string; description: string; template: string}> = [];
    export let updateParamValue: (name: string, value: string) => void;
    let selectedVariable = '';
    let textValue = '';

    function handleTextareaChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        textValue = target.value;
        updateParamValue(param.name, target.value);
    }

    function insertVariable(variable: string) {
        const cursorPosition = (document.querySelector('textarea') as HTMLTextAreaElement)?.selectionStart || textValue.length;
        const newValue = textValue.slice(0, cursorPosition) +
            `{{${variable}}}` +
            textValue.slice(cursorPosition);
        textValue = newValue;
        updateParamValue(param.name, newValue);
    }

    // Filter variables to show only text-compatible ones
    $: compatibleVariables = dynamicVariables.filter(v =>
        v.type === 'string' ||
        v.type === 'text' ||
        !['boolean', 'number'].includes(v.type)
    );

    // Update the value when it changes externally
    $: {
        if (!value.includes('{{')) {
            textValue = value;
        }
    }
</script>

<div class="relative space-y-2 flex flex-grow rounded-lg variant-ghost-primary p-6">
    <div class="flex flex-col justify-center items-center gap-2 flex-wrap w-1/3">
        <span class="text-lg">Insert variable:</span>
        {#if compatibleVariables.length > 0}
            <select
                    class="select max-w-[200px]"
                    value={selectedVariable}
                    on:change={(e) => {
                    if (e.target.value) {
                        insertVariable(e.target.value);
                        e.target.value = '';
                    }
                }}
            >
                <option value="">Choose a variable...</option>
                {#each compatibleVariables as variable}
                    <option value={variable.name}>
                        {variable.name} - {variable.description}
                    </option>
                {/each}
            </select>
        {:else}
            <span class="text-sm text-surface-600-300-token">No variables available</span>
        {/if}
    </div>

    <div class="relative w-2/3">
        <textarea
                class="textarea w-full h-32 font-mono text-sm"
                {required}
                value={textValue}
                on:input={handleTextareaChange}
                placeholder={param.details || 'Enter your text here...'}
        ></textarea>
    </div>
    {#if compatibleVariables.length > 0}
        <div class="text-xs text-surface-600-300-token absolute bottom-2">
            Available variables can be inserted anywhere in your text using the dropdown above or by typing <code class="bg-surface-200-700-token p-1 rounded">{"{{"}variableName{"}}"}</code>
        </div>
    {/if}
</div>

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
</style>