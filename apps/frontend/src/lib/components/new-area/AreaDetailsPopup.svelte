<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { X } from 'lucide-svelte';

    export let areaId: string;
    let area: any = null;
    let loading = true;
    export let token: string;
    let error: string | null = null;
    const API_URL = import.meta.env.VITE_API_URL;
    
    const dispatch = createEventDispatcher();
  
    onMount(async () => {
        console.log('areaId', areaId);
        console.log('token', token);
        if (!token) {
            error = 'No authentication token found';
            loading = false;
            return;
        }
        try {
            const response = await fetch(`${API_URL}/areas/${areaId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            area = await response.json();
            if (response.ok) {
               console.log('area', area);
            } else {
               error = 'Failed to fetch area details';
            }
        } catch (err) {
            error = 'Error fetching area details' + err;
            console.error(err);
        } finally {
            loading = false;
        }
    });
  
    function close() {
        dispatch('close');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-surface-100 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
            <h2 class="h2 text-primary-100-800-token font-bold">AREA Details</h2>
            <button on:click={close} class="text-surface-600 hover:text-surface-900">
                <X size={24} />
            </button>
        </div>
      
        {#if loading}
            <p>Loading...</p>
        {:else if error}
            <p class="text-error-500">{error}</p>
        {:else if area}
            <div class="space-y-4 text-surface-200-700-token">
                <div>
                    <h3 class="text-xl font-semibold mb-2">General Information</h3>
                    <p><strong>ID:</strong> {area._id}</p>
                    <p><strong>Status:</strong> {area.active ? 'Active' : 'Inactive'}</p>
                </div>
          
                <div>
                    <h3 class="text-xl font-semibold mb-2">Action</h3>
                    <p><strong>Service ID:</strong> {area.action.service_id}</p>
                    <p><strong>Is Webhook:</strong> {area.action.isWebhook ? 'Yes' : 'No'}</p>
                    <p><strong>Type:</strong> {area.action.informations.type}</p>
                    {#if area.action.informations.field}
                        <p><strong>Field:</strong> {area.action.informations.field}</p>
                    {/if}
                </div>
          
                <div>
                    <h3 class="text-xl font-semibold mb-2">Reaction</h3>
                    <p><strong>Service ID:</strong> {area.reaction.service_id}</p>
                    <p><strong>Type:</strong> {area.reaction.informations.type}</p>
                    {#if area.reaction.informations.field}
                        <p><strong>Field:</strong> {area.reaction.informations.field}</p>
                    {/if}
                </div>
          
                {#if area.action.history && area.action.history.exampleHistory}
                    <div>
                        <h3 class="text-xl font-semibold mb-2">Action History</h3>
                        <ul class="list-disc pl-5">
                            {#each area.action.history.exampleHistory as historyItem}
                                <li>{JSON.stringify(historyItem)}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>
        {:else}
            <p>No data available</p>
        {/if}
    </div>
</div>