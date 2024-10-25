<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import Icon from '@iconify/svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let service: {
        name: string;
        description: string;
        icon: string;
        connected: boolean;
        actions: Array<{
            name: string;
            description: string;
            type: string;
            params: Array<{
                name: string;
                type: string;
                required: boolean;
            }>;
        }>;
        reactions: Array<{
            name: string;
            description: string;
            type: string;
            params: Array<{
                name: string;
                type: string;
                required: boolean;
            }>;
        }>;
        oauthFunction: () => void;
    };

    let selectedTab: 'triggers' | 'actions' = 'triggers';

    function closeModal() {
        dispatch('close');
    }

    function handleConnect() {
        service.oauthFunction();
    }

    // Close modal when clicking outside
    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    // Close modal with escape key
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
        class="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        on:click={handleBackdropClick}
        transition:fade={{ duration: 200 }}
>
    <div
            class="bg-surface-100-800-token rounded-container-token w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-xl"
            transition:scale={{ duration: 200, start: 0.95 }}
    >
        <!-- Header -->
        <header class="p-4 border-b border-surface-500/30">
            <div class="flex items-center gap-4">
                <div class="p-2 rounded-xl bg-surface-500/10">
                    <Icon icon={service.icon} class="w-10 h-10" />
                </div>
                <div class="flex-1 min-w-0">
                    <h2 class="h2 truncate">{service.name}</h2>
                    <p class="text-sm text-surface-600-300-token truncate">{service.description}</p>
                </div>
                <div class="flex flex-col items-end gap-2">
                    <span
                            class="badge {service.connected ? 'variant-filled-success' : 'variant-filled-error'}"
                    >
                        {service.connected ? 'Connected' : 'Not Connected'}
                    </span>
                    {#if !service.connected}
                        <button class="btn variant-filled-primary btn-sm" on:click={handleConnect}>
                            <Icon icon="mdi:link-variant" class="w-4 h-4 mr-2" />
                            Connect
                        </button>
                    {/if}
                </div>
                <button
                        class="btn-icon hover:variant-soft rounded-full"
                        on:click={closeModal}
                        title="Close"
                >
                    <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
            </div>
        </header>

        <!-- Tabs -->
        <div class="border-b border-surface-500/30">
            <div class="flex gap-4 p-4">
                <button
                        class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold {selectedTab === 'triggers'
                        ? 'bg-primary-500/20 text-primary-700-50-token'
                        : 'hover:bg-surface-500/20'}"
                        on:click={() => (selectedTab = 'triggers')}
                >
                    <Icon icon="mdi:lightning-bolt" class="w-4 h-4" />
                    Triggers ({service.actions.length})
                </button>
                <button
                        class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold {selectedTab === 'actions'
                        ? 'bg-primary-500/20 text-primary-700-50-token'
                        : 'hover:bg-surface-500/20'}"
                        on:click={() => (selectedTab = 'actions')}
                >
                    <Icon icon="mdi:cog" class="w-4 h-4" />
                    Actions ({service.reactions.length})
                </button>
            </div>
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-[50vh] p-4">
            {#if selectedTab === 'triggers'}
                {#if service.actions.length === 0}
                    <div class="card variant-ghost-surface p-4">
                        <p class="text-center text-surface-600-300-token">
                            No triggers available for this service
                        </p>
                    </div>
                {:else}
                    <div class="space-y-4">
                        {#each service.actions as action}
                            <div class="card variant-soft p-4">
                                <h3 class="h3 flex items-center gap-2 mb-2">
                                    <Icon icon="mdi:lightning-bolt" class="w-5 h-5" />
                                    {action.name}
                                </h3>
                                <p class="text-surface-600-300-token mb-4">{action.description}</p>

                                {#if action.params.length > 0}
                                    <div class="space-y-2">
                                        <h4 class="font-semibold">Required Parameters:</h4>
                                        <ul class="list-disc list-inside space-y-1">
                                            {#each action.params.filter((p) => p.required) as param}
                                                <li>
                                                    <span class="font-medium">{param.name}</span>
                                                    <span class="text-surface-600-300-token">({param.type})</span>
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
            {:else}
                {#if service.reactions.length === 0}
                    <div class="card variant-ghost-surface p-4">
                        <p class="text-center text-surface-600-300-token">
                            No actions available for this service
                        </p>
                    </div>
                {:else}
                    <div class="space-y-4">
                        {#each service.reactions as reaction}
                            <div class="card variant-soft p-4">
                                <h3 class="h3 flex items-center gap-2 mb-2">
                                    <Icon icon="mdi:cog" class="w-5 h-5" />
                                    {reaction.name}
                                </h3>
                                <p class="text-surface-600-300-token mb-4">{reaction.description}</p>

                                {#if reaction.params.length > 0}
                                    <div class="space-y-2">
                                        <h4 class="font-semibold">Required Parameters:</h4>
                                        <ul class="list-disc list-inside space-y-1">
                                            {#each reaction.params.filter((p) => p.required) as param}
                                                <li>
                                                    <span class="font-medium">{param.name}</span>
                                                    <span class="text-surface-600-300-token">({param.type})</span>
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>