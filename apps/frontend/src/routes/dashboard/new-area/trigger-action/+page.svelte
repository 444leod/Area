<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import Icon from '@iconify/svelte';
    import { areaStore } from "$lib/store/areaStore";
    import { setError } from '$lib/store/errorMessage';
    import type { Action } from '@area/shared';
    import TriggerBtn from '$lib/components/new-area/TriggerBtn.svelte';
    import { getIconForApp } from "$lib/utils/getIconName";

    interface TriggerGroup {
        [key: string]: Action[];
    }

    interface PageData {
        triggerApp: {
            _id: string;
            name: string;
            actions: Action[];
            authorizations?: string[];
        };
        authorizations: string[];
    }

    export let data: PageData;

    let searchQuery = '';
    let mounted = false;

    onMount(() => {
        mounted = true;
        if (!$areaStore.triggerApp && browser) {
            goto('/dashboard/new-area/trigger-app');
        }
    });

    $: triggerApp = $areaStore.triggerApp || data.triggerApp;
    $: filteredTriggers = triggerApp?.actions.filter(action =>
        action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    $: groupedTriggers = filteredTriggers.reduce<TriggerGroup>((acc, trigger) => {
        const category = trigger.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(trigger);
        return acc;
    }, {});

    async function handleTriggerSelection(trigger: Action): Promise<void> {
        const requiredAuths = trigger.authorizations || [];
        const missingAuths = requiredAuths.filter(
            auth => !data.authorizations.includes(auth)
        );

        if (missingAuths.length > 0) {
            setError(
                `This trigger requires additional permissions: ${missingAuths.join(', ')}. ` +
                `<a href="/profile/authorization" class="anchor">Update permissions</a>`
            );
            return;
        }

        areaStore.setSelectedTrigger(trigger);
        if (browser) {
            await goto('/dashboard/new-area/action-app');
        }
    }
</script>

<div class="space-y-6" in:fade>
    <!-- Header with app info -->
    <div class="flex items-center gap-4 p-4 card variant-soft">
        <Icon
                icon={getIconForApp(triggerApp?.name || '')}
                class="w-12 h-12"
        />
        <div>
            <h2 class="h2">{triggerApp?.name}</h2>
            <p class="text-sm opacity-80">Select a trigger to continue</p>
        </div>
    </div>

    <!-- Search bar -->
    <div class="relative w-full">
        <Icon
                icon="mdi:magnify"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-500"
        />
        <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search triggers..."
                class="input pl-10 w-full"
        />
    </div>

    <!-- No results state -->
    {#if filteredTriggers.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-center" in:fade>
            <Icon icon="mdi:trigger-off" class="w-16 h-16 mb-4 text-surface-500" />
            <h3 class="h3 mb-2">No Triggers Found</h3>
            <p class="text-surface-500">
                Try adjusting your search terms
            </p>
        </div>
    {:else}
        <!-- Triggers grid -->
        {#each Object.entries(groupedTriggers) as [category, triggers]}
            <div class="space-y-4">
                <h3 class="h3">{category}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each triggers as trigger (trigger.type)}
                        <TriggerBtn
                                item={trigger.name}
                                type="trigger"
                                appName={triggerApp?.name}
                                description={trigger.description}
                                onClick={() => handleTriggerSelection(trigger)}
                        >
                            <svelte:fragment slot="footer">
                                {#if trigger.variables?.length}
                                    <div class="badge variant-soft-secondary">
                                        {trigger.variables.length} Variables Available
                                    </div>
                                {/if}
                                {#if trigger.authorizations?.length}
                                    <div class="badge variant-soft-warning">
                                        Auth Required
                                    </div>
                                {/if}
                            </svelte:fragment>
                        </TriggerBtn>
                    {/each}
                </div>
            </div>
        {/each}
    {/if}
    <div class="flex justify-between mt-8">
        <a href="/dashboard/new-area/trigger-app" class="btn variant-soft">
            <Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" />
            Back to Apps
        </a>
        {#if $areaStore.selectedTrigger}
            <button
                    class="btn variant-filled-primary"
                    on:click={() => goto('/dashboard/new-area/action-app')}
            >
                Continue
                <Icon icon="mdi:arrow-right" class="w-4 h-4 ml-2" />
            </button>
        {/if}
    </div>
    <div class="card variant-ghost p-4">
        <div class="flex items-start gap-4">
            <Icon icon="mdi:lightbulb-on" class="w-6 h-6 text-warning-500" />
            <div class="text-sm">
                <strong>Choosing a Trigger</strong>
                <p>Select what event should start your automation. Each trigger can provide variables that you can use in your actions later.</p>
            </div>
        </div>
    </div>
</div>