<script lang="ts">
    export let param: { name: string, details: string };
    export let value: number;
    export let updateParamValue: (name: string, value: number) => void;
    export let required: boolean;
</script>

<input
        id={param.name}
        type="number"
        class="input"
        {required}
        bind:value
        on:input={(e) => updateParamValue(param.name, parseFloat(e.currentTarget.value))}
        placeholder={param.details}
/>