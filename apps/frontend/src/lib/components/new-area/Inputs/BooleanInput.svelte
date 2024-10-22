<script lang="ts">
    export let param: { name: string };
    export let value: boolean;
    export let updateParamValue: (name: string, value: boolean) => void;
    export let required: boolean;
</script>

<label class="flex items-center space-x-2">
    <input
            id={param.name}
            type="checkbox"
            class="checkbox"
            bind:checked={value}
            {required}
            on:change={(e) => updateParamValue(param.name, e.currentTarget.checked)}
    />
    <span>{param.name}</span>
</label>