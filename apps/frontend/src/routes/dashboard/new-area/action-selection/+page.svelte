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

    interface PageData {
        authorizations: string[];
    }

    export let data: PageData;

    let searchQuery = '';
    let selectedCategory = 'All';

    onMount(() => {
        if (!$areaStore.triggerApp || !$areaStore.selectedTrigger || !$areaStore.actionApp) {
            goto('/dashboard/new-area/action-app');
        }
    });

    $: actionApp = $areaStore.actionApp;
    $: filteredActions = actionApp?.reactions.filter(action =>
        action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    $: groupedActions = filteredActions.reduce((acc, action) => {
        const category = action.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(action);
        return acc;
    }, {} as Record<string, Action[]>);

    $: categories = ['All', ...Object.keys(groupedActions)];

    $: displayedActions = selectedCategory === 'All'
        ? filteredActions
        : groupedActions[selectedCategory] || [];

    async function handleActionSelection(action: Action): Promise<void> {
        const requiredAuths = action.authorizations || [];
        const missingAuths = requiredAuths.filter(
            auth => !data.authorizations.includes(auth)
        );

        if (missingAuths.length > 0) {
            setError(
                `This action requires additional permissions: ${missingAuths.join(', ')}. ` +
                `<a href="/profile/authorization" class="anchor">Update permissions</a>`
            );
            return;
        }

        areaStore.setSelectedAction(action);
        if (browser) {
            await goto('/dashboard/new-area/configure');
        }
    }
</script>

<div class="space-y-6" in:fade>
    <!-- Workflow Summary -->
    <div class="card variant-soft p-4">
        <div class="flex items-center gap-4 flex-wrap">
            <!-- Trigger App -->
            <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-full variant-filled-surface flex items-center justify-center">
                    <Icon icon={getIconForApp($areaStore.triggerApp?.name || '')} class="w-6 h-6" />
                </div>
                <div class="text-sm">
                    <p class="font-medium">{$areaStore.triggerApp?.name}</p>
                    <p class="opacity-80">{$areaStore.selectedTrigger?.name}</p>
                </div>
            </div>

            <Icon icon="mdi:arrow-right" class="w-5 h-5" />

            <!-- Action App -->
            <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-full variant-filled-surface flex items-center justify-center">
                    <Icon icon={getIconForApp($areaStore.actionApp?.name || '')} class="w-6 h-6" />
                </div>
                <div class="text-sm">
                    <p class="font-medium">{$areaStore.actionApp?.name}</p>
                    <p class="opacity-80">Choose an action</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="relative w-full md:w-96">
            <Icon
                    icon="mdi:magnify"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-500"
            />
            <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search actions..."
                    class="input pl-10 w-full"
            />
        </div>

        {#if categories.length > 1}
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
        {/if}
    </div>

    <!-- Available Variables Info -->
    {#if $areaStore.selectedTrigger?.variables?.length}
        <div class="card variant-ghost-primary p-4">
            <div class="flex items-start gap-4">
                <Icon icon="mdi:variable" class="w-6 h-6 text-primary-500" />
                <div>
                    <h3 class="h3 mb-1">Available Variables</h3>
                    <p class="text-sm">
                        You'll be able to use {$areaStore.selectedTrigger.variables.length} variables
                        from {$areaStore.triggerApp?.name} in your action configuration.
                    </p>
                </div>
            </div>
        </div>
    {/if}

    <!-- Actions Grid -->
    {#if displayedActions.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-center" in:fade>
            <Icon icon="mdi:flash-off" class="w-16 h-16 mb-4 text-surface-500" />
            <h3 class="h3 mb-2">No Actions Found</h3>
            <p class="text-surface-500">
                Try adjusting your search terms
            </p>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" in:fade>
            {#each displayedActions as action (action.type)}
                <TriggerBtn
                        item={action.name}
                        type="action"
                        appName={actionApp?.name}
                        description={action.description}
                        onClick={() => handleActionSelection(action)}
                >
                    <svelte:fragment slot="footer">
                        {#if action.authorizations?.length}
                            <div class="badge variant-soft-warning">
                                Auth Required
                            </div>
                        {/if}
                        {#if action.variables_supported}
                            <div class="badge variant-soft-primary">
                                Supports Variables
                            </div>
                        {/if}
                    </svelte:fragment>
                </TriggerBtn>
            {/each}
        </div>
    {/if}

    <!-- Navigation -->
    <div class="flex justify-between mt-8">
        <a href="/dashboard/new-area/action-app" class="btn variant-soft">
            <Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" />
            Back to Apps
        </a>
        {#if $areaStore.selectedAction}
            <button
                    class="btn variant-filled-primary"
                    on:click={() => goto('/dashboard/new-area/configure')}
            >
                Configure Action
                <Icon icon="mdi:arrow-right" class="w-4 h-4 ml-2" />
            </button>
        {/if}
    </div>

    <!-- Help Tooltip -->
    <div class="card variant-ghost p-4">
        <div class="flex items-start gap-4">
            <Icon icon="mdi:lightbulb-on" class="w-6 h-6 text-warning-500" />
            <div class="text-sm">
                <strong>Choosing an Action</strong>
                <p>Select what should happen when your trigger conditions are met. You'll be able to configure the specific details in the next step.</p>
                {#if $areaStore.selectedTrigger?.variables?.length}
                    <p class="mt-2">
                        Look for actions with the "Supports Variables" badge to make the most of your trigger's data.
                    </p>
                {/if}
            </div>
        </div>
    </div>
</div>