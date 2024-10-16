<script lang="ts">
    import { Check } from 'lucide-svelte';

    export let name: string;
    export let description: string;
    export let icon: string;
    export let connected: boolean;
    export let onConnect: () => void;
    export let buttonColor: string = 'variant-filled-primary';
</script>

<div class="service-card card variant-soft-surface p-8 flex flex-col md:flex-row items-center justify-between">
    <div class="flex flex-col md:flex-row items-center mb-6 md:mb-0">
        <div class="w-16 h-16 mb-4 md:mb-0 md:mr-6">
            {@html icon}
        </div>
        <div>
            <h2 class="h2 mb-2">{name}</h2>
            <p class="text-surface-600-300-token">{description}</p>
        </div>
    </div>
    {#if !connected}
        <button
                class="btn btn-xl {buttonColor}"
                on:click={onConnect}
        >
            Connect {name}
        </button>
    {:else}
        <div class="flex items-center">
            <Check class="w-8 h-8 text-success-500 mr-4" />
            <span class="text-success-500 text-xl font-bold">Connected</span>
        </div>
    {/if}
</div>