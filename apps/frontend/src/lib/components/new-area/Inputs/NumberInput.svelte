<script>
    export let param;
    export let value;
    export let updateParamValue;
    export let details;
</script>

<input
        id={param.name}
        type="number"
        class="input w-full"
        bind:value={value}
        on:input={(e) => updateParamValue(param.name, parseFloat(e.target.value))}
        placeholder={`Enter ${param.details}`}
/>