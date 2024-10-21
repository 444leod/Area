<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let options: string[];
    export let value: string = '';
    export let required: boolean = false;

    const dispatch = createEventDispatcher();

    function handleChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        dispatch('change', target.value);
    }
</script>

<select
        class="select"
        {required}
        bind:value
        on:change={handleChange}
>
    <option value="" disabled selected>Select an option</option>
    {#each options as option}
        <option value={option}>{option}</option>
    {/each}
</select>
