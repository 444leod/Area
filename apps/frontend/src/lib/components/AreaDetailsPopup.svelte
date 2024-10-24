<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { X, Trash2, Copy, ToggleLeft, ToggleRight, Plus, Minus, ArrowDown } from 'lucide-svelte';
	import { getAreaById } from '$lib/modules/getAreaById';
	import { deleteAreaById } from '$lib/modules/deleteAreaById';
	import { toggleAreaStatus } from '$lib/modules/toggleAreaStatus';
	import { setError } from '$lib/store/errorMessage';

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
			setError(error);
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
		return key
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	function truncateText(text: string, maxLength: number = 20): string {
		return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
	}

	async function copyToClipboard(text: string, event: MouseEvent) {
		await navigator.clipboard.writeText(text);
		const button = event.currentTarget as HTMLButtonElement;
		button.classList.add('text-success-500');
		button.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>';
		setTimeout(() => {
			button.classList.remove('text-success-500');
			button.innerHTML =
				'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
		}, 2000);
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
	<div
		class="bg-surface-50-900-token p-6 rounded-lg w-[90%] md:max-w-4xl md:w-full max-h-[90vh] overflow-y-auto"
	>
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-2xl font-bold text-primary-500">AREA Workflow</h2>
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
						<h3 class="h3 font-bold mt-1">{area.name}</h3>
						<span class="text-sm font-semibold text-surface-700-200-token">ID: {area._id}</span>
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
								<div class="flex items-center space-x-2">
									<strong>{formatKey(key)}:</strong>
									<span class="truncate">
										{key.toLowerCase() === 'type' ? value : truncateText(value)}
									</span>
									<button
										on:click={(e) => copyToClipboard(value, e)}
										class="text-primary-500 hover:text-primary-700 transition-colors duration-200"
										title="Copy full text"
									>
										<Copy class="w-4 h-4" />
									</button>
								</div>
							{/each}
						</div>
					</div>

					<div class="flex justify-center">
						<ArrowDown class="w-6 h-6 text-primary-500" />
					</div>

					<div class="card variant-soft p-4">
						<h3 class="text-lg font-semibold mb-3 flex items-center">
							<Minus class="w-5 h-5 mr-2 text-secondary-500" />
							Reaction
						</h3>
						<div class="grid grid-cols-2 gap-4">
							{#each Object.entries(area.reaction.informations) as [key, value]}
								<div class="flex items-center space-x-2">
									<strong>{formatKey(key)}:</strong>
									<span class="truncate">
										{key.toLowerCase() === 'type' ? value : truncateText(value)}
									</span>
									<button
										on:click={(e) => copyToClipboard(value, e)}
										class="text-primary-500 hover:text-primary-700 transition-colors duration-200"
										title="Copy full text"
									>
										<Copy class="w-4 h-4" />
									</button>
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
								<li class="flex items-center space-x-2">
									<span class="truncate">{truncateText(JSON.stringify(historyItem))}</span>
									<button
										on:click={(e) => copyToClipboard(JSON.stringify(historyItem), e)}
										class="text-primary-500 hover:text-primary-700 transition-colors duration-200"
										title="Copy full history item"
									>
										<Copy class="w-4 h-4" />
									</button>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<div class="flex justify-end mt-6">
					<button on:click={deleteArea} class="btn variant-filled-error" disabled={deleteLoading}>
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
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
