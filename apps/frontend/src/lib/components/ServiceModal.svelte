<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Icon  from '@iconify/svelte';
    import { X } from 'lucide-svelte';

    export let show = false;
    export let service: any = null;
    export let onClose: () => void;
</script>

{#if show && service}
    <div
            class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50"
            on:click|self={onClose}
            transition:fade={{ duration: 200 }}
    >
        <div
                class="card variant-soft-primary w-full max-w-2xl mx-4"
                transition:scale={{ duration: 200, easing: quintOut }}
        >
            <header class="card-header flex justify-between items-center p-4">
                <div class="flex items-center gap-3">
                    {#if service.icon}
                        <Icon icon={service.icon} class="text-3xl" />
                    {/if}
                    <h2 class="h2">{service.name}</h2>
                </div>
                <button class="btn-icon variant-soft hover:variant-filled-surface" on:click={onClose}>
                    <X />
                </button>
            </header>
            <hr class="opacity-50" />
            <section class="p-4 space-y-4">
                {#if service.actions?.length > 0}
                    <div class="card variant-soft p-4">
                        <h3 class="h3 mb-4 flex items-center gap-2">
                            <span class="badge variant-filled-primary">Actions</span>
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each service.actions as action}
                                <div class="card variant-ghost p-3">
                                    <h4 class="font-bold mb-2">{action.name}</h4>
                                    <p class="text-sm">{action.description || 'No description available'}</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if service.reactions?.length > 0}
                    <div class="card variant-soft p-4">
                        <h3 class="h3 mb-4 flex items-center gap-2">
                            <span class="badge variant-filled-secondary">Reactions</span>
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each service.reactions as reaction}
                                <div class="card variant-ghost p-3">
                                    <h4 class="font-bold mb-2">{reaction.name}</h4>
                                    <p class="text-sm">{reaction.description || 'No description available'}</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if (!service.actions?.length && !service.reactions?.length)}
                    <div class="text-center p-4">
                        <p class="text-surface-400">No actions or reactions available</p>
                    </div>
                {/if}
            </section>
        </div>
    </div>
{/if}