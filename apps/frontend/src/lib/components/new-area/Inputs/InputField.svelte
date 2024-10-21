<script lang="ts">
    export let label: string;
    export let type: 'string' | 'number' | 'boolean' = 'string';
    export let value: string | number | boolean = '';
    export let placeholder: string = '';
    export let required: boolean = false;
    export let details: string = '';
    export let updateValue: (value: string | number | boolean) => void;

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        let newValue: string | number | boolean;

        if (type === 'number') {
            newValue = target.valueAsNumber;
        } else if (type === 'boolean') {
            newValue = target.checked;
        } else {
            newValue = target.value;
        }

        updateValue(newValue);
    }
</script>

<div class="mb-4">
    <label for={label} class="block text-sm font-medium text-gray-700 mb-1">
        {label}{required ? ' *' : ''}
    </label>
    {#if type === 'boolean'}
        <input
                type="checkbox"
                id={label}
                checked={value}
                on:change={handleInput}
                class="form-checkbox h-5 w-5 text-indigo-600"
                {required}
        />
    {:else}
        <input
                type={type === 'number' ? 'number' : 'text'}
                id={label}
                {placeholder}
                {value}
                on:input={handleInput}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {required}
        />
    {/if}
    {#if details}
        <p class="mt-2 text-sm text-gray-500">{details}</p>
    {/if}
</div>