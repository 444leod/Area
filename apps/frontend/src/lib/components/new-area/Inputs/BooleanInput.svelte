<script lang="ts">
    export let param;
    export let value;
    export let updateParamValue;
</script>

<input
        id={param.name}
        type="checkbox"
        class="checkbox"
        bind:checked={value}
        on:change={(e) => updateParamValue(param.name, e.target.checked)}
/>