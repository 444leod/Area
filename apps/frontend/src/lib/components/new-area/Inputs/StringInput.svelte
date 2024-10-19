<script>
    export let param;
    export let value;
    export let updateParamValue;
    export let details;
</script>

<input
        id={param.name}
        type="text"
        class="input w-full"
        bind:value={value}
        on:input={(e) => updateParamValue(param.name, e.target.value)}
        placeholder={`Enter ${param.details}`}
/>