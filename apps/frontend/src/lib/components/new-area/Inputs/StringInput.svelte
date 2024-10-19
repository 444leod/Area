<script lang="ts">
    export let param: { name: string, details: string };
    export let value: string;
    export let updateParamValue: (name: string, value: string) => void;
    export let required: boolean;
</script>

<input
        id={param.name}
        type="text"
        class="input"
        {required}
        bind:value
        on:input={(e) => updateParamValue(param.name, e.currentTarget.value)}
        placeholder={param.details}
/>