<script lang="ts">
    import { ReceiptText, LogIn, LogOut } from 'lucide-svelte';
    import Icon from '@iconify/svelte';

    export let name: string;
    export let description: string;
    export let icon: string;
    export let connected: boolean;
    export let onConnect: () => void;
    export let onDisconnect: () => void;
    export let onDetails: () => void;
</script>

<div
        class="card variant-ghost-secondary card-hover p-6 flex flex-col items-center justify-between h-80"
>
    <div class="w-16 h-16 mb-4">
        <Icon icon={icon} width="64" height="64" />
    </div>
    <h2 class="h3 mb-2 text-center">{name}</h2>
    <p class="text-center mb-4">{description}</p>
    <div class="flex flex-row items-center justify-center w-full gap-5">
        <button
                class="btn btn-base variant-soft-secondary"
                on:click={onDetails}
        >
            <ReceiptText />
            <span>Details</span>
        </button>
        <button
                class="btn btn-base variant-filled-primary"
                on:click={connected ? onDisconnect : onConnect}
        >
            {#if connected}
                <LogOut />
                <span>Disconnect</span>
            {:else}
                <LogIn />
                <span>Connect</span>
            {/if}
        </button>
    </div>
    <div class="flex items-center justify-center w-full mt-4">
        <span class="badge {connected ? 'variant-soft-success' : 'variant-soft-error'}">
            {connected ? 'Connected' : 'Disconnected'}
        </span>
    </div>
</div>