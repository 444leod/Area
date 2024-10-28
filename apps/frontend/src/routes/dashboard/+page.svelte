<script lang="ts">
	import { PlusCircle, LogOut, Info, ToggleLeft, ToggleRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import AreaDetailsPopup from '$lib/components/AreaDetailsPopup.svelte';
	import { toggleAreaStatus } from '$lib/modules/toggleAreaStatus';
	import { setError } from '$lib/store/errorMessage';
	import { fade, fly } from 'svelte/transition';

	export let data: PageData;

	let areas = data.services;
	let selectedAreaId: string | null = null;
	let showDetailsPopup = false;
	let toggleLoadingMap = new Map();

	$: stats = {
		totalAutomations: areas.length,
		activeAutomations: areas.filter((area) => area.active).length,
		totalRuns: areas.reduce((acc, area) => acc + (area.totalRuns || 0), 0),
		successRate: calculateSuccessRate(areas)
	};

	function calculateSuccessRate(areas) {
		const totalRuns = areas.reduce((acc, area) => acc + (area.totalRuns || 0), 0);
		const successfulRuns = areas.reduce((acc, area) => acc + (area.successfulRuns || 0), 0);
		return totalRuns ? `${((successfulRuns / totalRuns) * 100).toFixed(1)}%` : '0%';
	}

	$: isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;

	function handleResize() {
		isSmallScreen = window.innerWidth < 640;
	}

	async function handleLogout() {
		const response = await fetch('/api/logout', { method: 'POST' });
		if (response.ok) {
			goto('/login');
		}
	}

	function getAreaName(area) {
		return area.name || 'Unnamed Automation';
	}

	function showAreaDetails(areaId: string) {
		selectedAreaId = areaId;
		showDetailsPopup = true;
	}

	function handleAreaDeleted(event: CustomEvent) {
		const deletedAreaId = event.detail.areaId;
		areas = areas.filter((area) => area._id !== deletedAreaId);
	}

	function closeDetailsPopup() {
		showDetailsPopup = false;
		selectedAreaId = null;
	}

	async function toggleAreaButton(area) {
		if (toggleLoadingMap.get(area._id)) return;

		toggleLoadingMap.set(area._id, true);
		areas = [...areas]; // Trigger reactivity

		try {
			await toggleAreaStatus(area._id, data.token);
			areas = areas.map((a) => {
				if (a._id === area._id) {
					return { ...a, active: !a.active };
				}
				return a;
			});
		} catch (e) {
			setError(`Error toggling area status: ${e.message}`);
		} finally {
			toggleLoadingMap.set(area._id, false);
			areas = [...areas];
		}
	}
</script>

<svelte:window on:resize={handleResize} />

<div class="container mx-auto px-4 py-8">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
		<h1 class="h1">Dashboard</h1>
		<button class="btn variant-ghost-surface hover:variant-soft-surface" on:click={handleLogout}>
			<LogOut class="w-4 h-4 mr-2" />
			Logout
		</button>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		{#each Object.entries(stats) as [key, value], i}
			<div
				class="card variant-ghost-secondary p-6"
				in:fly={{ y: 20, duration: 300, delay: i * 100 }}
			>
				<h3 class="h4 mb-3 opacity-75">
					{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
				</h3>
				<p class="text-3xl font-bold">{value}</p>
			</div>
		{/each}
	</div>

	<div class="variant-ghost-secondary card p-6 mb-8" in:fade={{ duration: 300 }}>
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
			<h2 class="h2 mb-4 sm:mb-0">Your Automations</h2>
			<a
				href="/dashboard/new-area"
				class="btn variant-filled-primary w-full sm:w-auto hover:variant-filled-secondary transition-colors duration-200"
			>
				<PlusCircle class="w-4 h-4 mr-2" />
				New Automation
			</a>
		</div>

		{#if isSmallScreen}
			<div class="space-y-4">
				{#each areas as area, i (area._id)}
					<div class="card variant-soft p-4" in:fly={{ y: 20, duration: 300, delay: i * 50 }}>
						<div class="flex justify-between items-center mb-4">
							<h3 class="h3">{getAreaName(area)}</h3>
							<button
								class="btn-icon variant-soft hover:variant-filled-surface"
								on:click={() => showAreaDetails(area._id)}
							>
								<Info class="w-4 h-4" />
							</button>
						</div>
						<button
							on:click={() => toggleAreaButton(area)}
							class="btn w-full {area.active
								? 'variant-filled-success hover:variant-soft-success'
								: 'variant-filled-warning hover:variant-soft-warning'} transition-colors duration-200"
							disabled={toggleLoadingMap.get(area._id)}
						>
							{#if toggleLoadingMap.get(area._id)}
								<div class="loader-sm mr-2" />
							{:else if area.active}
								<ToggleRight class="w-5 h-5 mr-2" />
							{:else}
								<ToggleLeft class="w-5 h-5 mr-2" />
							{/if}
							{area.active ? 'Active' : 'Inactive'}
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<div class="  p-4">
				{#if areas.length === 0}
					<p class="text-center h3 text-surface-400 py-8">
						No automations found, create a new one !
					</p>
				{:else}
					<table class="table table-hover">
						<thead>
							<tr>
								<th class="!p-4">Name</th>
								<th class="!p-4">Status</th>
								<th class="text-right !p-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each areas as area, i (area._id)}
								<tr
									class="hover:variant-soft-surface transition-colors duration-200"
									in:fly={{ y: 20, duration: 300, delay: i * 50 }}
								>
									<td class="!p-4">
										<span class="font-semibold h3">{getAreaName(area)}</span>
									</td>
									<td class="!p-4">
										<button
											on:click={() => toggleAreaButton(area)}
											class="btn {area.active
												? 'variant-filled-success hover:variant-soft-success'
												: 'variant-filled-warning hover:variant-soft-warning'} transition-all duration-200"
											disabled={toggleLoadingMap.get(area._id)}
										>
											{#if toggleLoadingMap.get(area._id)}
												<div class="loader-sm mr-2" />
											{:else if area.active}
												<ToggleRight class="w-5 h-5 mr-2" />
											{:else}
												<ToggleLeft class="w-5 h-5 mr-2" />
											{/if}
											{area.active ? 'Active' : 'Inactive'}
										</button>
									</td>
									<td class="!p-4 text-right">
										<button
											class="btn-icon variant-soft hover:variant-filled-surface transition-colors duration-200"
											on:click={() => showAreaDetails(area._id)}
										>
											<Info class="w-4 h-4" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		{/if}
	</div>
</div>

{#if showDetailsPopup && selectedAreaId}
	<AreaDetailsPopup
		areaId={selectedAreaId}
		token={data.token}
		on:close={closeDetailsPopup}
		on:areaDeleted={handleAreaDeleted}
		on:areaUpdated={({ detail }) => {
			areas = areas.map((area) =>
				area._id === detail.areaId ? { ...area, active: detail.active } : area
			);
		}}
	/>
{/if}

<style>
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

	:global(.table) {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
	}

	:global(.table th) {
		text-transform: uppercase;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.025em;
		color: var(--color-surface-500);
	}
</style>
