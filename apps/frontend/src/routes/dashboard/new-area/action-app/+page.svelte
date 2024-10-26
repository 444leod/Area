<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import Icon from '@iconify/svelte';
    import { areaStore } from "$lib/store/areaStore";
    import { setError } from '$lib/store/errorMessage';
    import type { App } from '@area/shared';
    import AppCard from '$lib/components/new-area/AppCard.svelte';
    import { getIconForApp } from "$lib/utils/getIconName";

    interface PageData {
        groupedServices: Record<string, App[]>;
        authorizations: string[];
    }

    export let data: PageData;

    let searchQuery = '';
    let selectedCategory = 'All';

    onMount(() => {
        // Verify we have the necessary previous selections
        if (!$areaStore.triggerApp || !$areaStore.selectedTrigger) {
            goto('/dashboard/new-area/trigger-app');
        }
    });

    $: categories = ['All', ...Object.keys(data.groupedServices || {})];
    $: filteredServices = Object.entries(data.groupedServices || {})
        .flatMap(([category, services]) =>
            selectedCategory === 'All' || selectedCategory === category
                ? services
                : []
        )
        .filter(service =>
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    async function handleServiceSelection(service: App) {
        const requiredAuths = service.required_authorizations || [];
        const missingAuths = requiredAuths.filter(
            auth => !data.authorizations.includes(auth)
        );

        if (missingAuths.length > 0) {
            setError(
                `Please connect your ${missingAuths.join(', ')} account(s) before using this service. ` +
                `<a href="/profile/authorization" class="anchor">Go to Authorizations</a>`
            );
            return;
        }

        areaStore.setActionApp(service);
        if (browser) {
            await goto('/dashboard/new-area/action-selection');
        }
    }
</script>

<div class="space-y-6" in:fade>
    <!-- Current selection summary -->
    <div class="card variant-soft p-4">
        <div class="flex items-center gap-4 mb-4">
            <Icon icon={getIconForApp($areaStore.triggerApp?.name || '')} class="w-8 h-8" />
            <div>
                <h3 class="h3">{$areaStore.triggerApp?.name}</h3>
                <p class="text-sm opacity-80">{$areaStore.selectedTrigger?.name}</p>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <Icon icon="mdi:arrow-right" class="w-5 h-5" />
            <p class="text-sm font-medium">Choose an action app to continue</p>
        </div>
    </div>

    <!-- Search and categories -->
    <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="relative w-full md:w-96">
            <Icon
                    icon="mdi:magnify"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-500"
            />
            <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search services..."
                    class="input pl-10 w-full"
            />
        </div>

        <div class="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {#each categories as category}
                <button
                        class="btn {selectedCategory === category ? 'variant-filled-primary' : 'variant-soft'}"
                        on:click={() => selectedCategory = category}
                >
                    {category}
                </button>
            {/each}
        </div>
    </div>

    <!-- Service grid -->
    {#if filteredServices.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-center" in:fade>
            <Icon icon="mdi:app-off" class="w-16 h-16 mb-4 text-surface-500" />
            <h3 class="h3 mb-2">No Services Found</h3>
            <p class="text-surface-500">
                Try adjusting your search or category filter
            </p>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" in:fade>
            {#each filteredServices as service (service._id)}
                <AppCard
                        app={{
                        id: service._id,
                        name: service.name
                    }}
                        onClick={() => handleServiceSelection(service)}
                />
            {/each}
        </div>
    {/if}

    <!-- Navigation -->
    <div class="flex justify-between mt-8">
        <a href="/dashboard/new-area/trigger-action" class="btn variant-soft">
            <Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" />
            Back to Trigger Selection
        </a>
    </div>

    <!-- Help tooltip -->
    <div class="card variant-ghost p-4">
        <div class="flex items-start gap-4">
            <Icon icon="mdi:lightbulb-on" class="w-6 h-6 text-warning-500" />
            <div class="text-sm">
                <strong>Choosing an Action App</strong>
                <p>Select the app that will perform actions when your trigger conditions are met. You'll be able to configure the specific action in the next step.</p>
                {#if $areaStore.selectedTrigger?.variables?.length}
                    <p class="mt-2 text-primary-500">
                        💡 You'll be able to use {$areaStore.selectedTrigger.variables.length} variables from your trigger in the action setup.
                    </p>
                {/if}
            </div>
        </div>
    </div>
</div>