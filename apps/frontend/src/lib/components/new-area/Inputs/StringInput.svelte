<script lang="ts">
    export let param;
    export let value;
    export let updateParamValue;
</script>

<input
        id={param.name}
        type="text"
        class="input w-full"
        bind:value={value}
        on:input={(e) => updateParamValue(param.name, e.target.value)}
        placeholder={`Enter ${param.name}`}
/>