<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { X, Trash2, ToggleLeft, ToggleRight, ArrowRight, Plus, Minus } from 'lucide-svelte';
    import { getAreaById } from '$lib/modules/getAreaById';
    import { deleteAreaById } from '$lib/modules/deleteAreaById';
    import { toggleAreaStatus } from '$lib/modules/toggleAreaStatus';

    export let areaId: string;
    export let token: string;
    let area: any = null;
    let loading = true;
    let error: string | null = null;
    let deleteLoading = false;
    let toggleLoading = false;

    const dispatch = createEventDispatcher();
  
    onMount(async () => {
        try {
            area = await getAreaById(areaId, token);
            loading = false;
        } catch (e) {
            error = e.message;
            loading = false;
        }
    });
  
    function close() {
        dispatch('close');
    }

    async function deleteArea() {
        if (!confirm('Are you sure you want to delete this area?')) {
            return;
        }
        
        deleteLoading = true;
        try {
            await deleteAreaById(areaId, token);
            dispatch('areaDeleted', { areaId });
            close();
        } catch (e) {
            error = `Error deleting area: ${e.message}`;
            console.error(e);
        } finally {
            deleteLoading = false;
        }
    }

    async function toggleAreaButton() {
        toggleLoading = true;
        try {
            await toggleAreaStatus(areaId, token);
            area.active = !area.active;
            dispatch('areaUpdated', { areaId, active: area.active });
        } catch (e) {
            error = `Error toggling area status: ${e.message}`;
            console.error(e);
        } finally {
            toggleLoading = false;
        }
    }

    function formatKey(key: string): string {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-surface-50-900-token p-6 rounded-lg w-[90%] md:max-w-4xl md:w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-primary-500">AREA Details</h2>
            <button on:click={close} class="text-surface-600 hover:text-surface-900">
                <X size={24} />
            </button>
        </div>
      
        {#if loading}
            <div class="flex justify-center items-center h-64">
                <div class="loader"></div>
            </div>
        {:else if error}
            <p class="text-error-500 text-center">{error}</p>
        {:else if area}
            <div class="space-y-6 text-surface-700-200-token">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="text-sm font-semibold text-surface-700-200-token">ID: {area._id}</span>
                        <h3 class="text-xl font-bold mt-1">Area Workflow</h3>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button 
                            on:click={toggleAreaButton}
                            class="btn {area.active ? 'variant-filled-success' : 'variant-filled-warning'}"
                            disabled={toggleLoading}
                        >
                            {#if toggleLoading}
                                <div class="loader-sm mr-2"></div>
                            {:else if area.active}
                                <ToggleRight class="w-5 h-5 mr-2" />
                            {:else}
                                <ToggleLeft class="w-5 h-5 mr-2" />
                            {/if}
                            {area.active ? 'Active' : 'Inactive'}
                        </button>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="card variant-soft p-4">
                        <h3 class="text-lg font-semibold mb-3 flex items-center">
                            <Plus class="w-5 h-5 mr-2 text-primary-500" />
                            Action
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                            {#each Object.entries(area.action.informations) as [key, value]}
                                <div>
                                    <strong>{formatKey(key)}:</strong> {value}
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="flex justify-center">
                        <ArrowRight class="w-6 h-6 text-primary-500" />
                    </div>

                    <div class="card variant-soft p-4">
                        <h3 class="text-lg font-semibold mb-3 flex items-center">
                            <Minus class="w-5 h-5 mr-2 text-secondary-500" />
                            Reaction
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                            {#each Object.entries(area.reaction.informations) as [key, value]}
                                <div>
                                    <strong>{formatKey(key)}:</strong> {value}
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>

                {#if area.action.history && area.action.history.exampleHistory && area.action.history.exampleHistory.length > 0}
                    <div class="card variant-soft p-4">
                        <h3 class="text-lg font-semibold mb-3">Action History</h3>
                        <ul class="list-disc pl-5">
                            {#each area.action.history.exampleHistory as historyItem}
                                <li>{JSON.stringify(historyItem)}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                <div class="flex justify-end mt-6">
                    <button 
                        on:click={deleteArea} 
                        class="btn variant-filled-error"
                        disabled={deleteLoading}
                    >
                        {#if deleteLoading}
                            <div class="loader-sm mr-2"></div>
                            Deleting...
                        {:else}
                            <Trash2 class="w-4 h-4 mr-2" />
                            Delete Area
                        {/if}
                    </button>
                </div>
            </div>
        {:else}
            <p class="text-center text-surface-700-200-token">No data available</p>
        {/if}
    </div>
</div>

<style>
    .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }

    .loader-sm {
        border: 2px solid #f3f3f3;
        border-top: 2px solid #ffffff;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>