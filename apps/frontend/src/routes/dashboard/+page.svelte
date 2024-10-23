<script lang="ts">
	import { PlusCircle, BarChart2, LogOut, Info } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import AreaDetailsPopup from '$lib/components/new-area/AreaDetailsPopup.svelte';

	export let data: PageData;

	let areas = data.services;
	let selectedAreaId: string | null = null;
	let showDetailsPopup = false;

	let stats = {
		totalAutomations: areas.length,
		activeAutomations: areas.filter((area) => area.active).length,
		totalRuns: 0,
		successRate: '99.5%'
	};

	function toggleAutomationStatus(area) {
		area.active = !area.active;
		areas = [...areas];
		stats.activeAutomations = areas.filter((area) => area.active).length;
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

	function closeDetailsPopup() {
		showDetailsPopup = false;
		selectedAreaId = null;
	}
</script>

<svelte:window on:resize={handleResize} />

<div class="container mx-auto px-4 py-8">
	<div class="flex flex-row items-center justify-between">
		<h1 class="h1 mb-8">Dashboard</h1>
		<button class="btn variant-soft-secondary " on:click={handleLogout}>
			<LogOut class="w-4 h-4 mr-2" />
			Logout
		</button>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		{#each Object.entries(stats) as [key, value]}
			<div class="card p-4 variant-soft">
				<h3 class="h4 mb-2">
					{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
				</h3>
				<p class="text-2xl font-bold">{value}</p>
			</div>
		{/each}
	</div>
	<div class="card variant-soft p-4 mb-8">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
			<h2 class="h2 mb-2 sm:mb-0">Your Automations</h2>
			<a href="/dashboard/new-area" class="btn variant-filled-primary w-full sm:w-auto">
				<PlusCircle class="w-4 h-4 mr-2" />
				New Automation
			</a>
		</div>

		{#if isSmallScreen}
			<div class="space-y-4">
				{#each areas as area}
					<div class="card p-4 variant-soft">
						<h3 class="font-bold mb-2">{getAreaName(area)}</h3>
						<div class="flex justify-between items-center mb-2">
							<span
								class="badge {area.active ? 'variant-filled-success' : 'variant-filled-warning'}"
							>
								{area.active ? 'Active' : 'Paused'}
							</span>
						</div>
						<div class="flex justify-between">
							<button class="btn btn-sm variant-soft" on:click={() => toggleAutomationStatus(area)}>
								{area.active ? 'Pause' : 'Activate'}
							</button>
							<button class="btn btn-sm variant-soft" on:click={() => showAreaDetails(area._id)}>
								<Info class="w-4 h-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<table class="table table-compact table-hover">
				<thead>
					<tr>
						<th>Name</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each areas as area}
						<tr>
							<td class="font-bold">{getAreaName(area)}</td>
							<td>
								<span
									class="badge {area.active ? 'variant-filled-success' : 'variant-filled-warning'}"
								>
									{area.active ? 'Active' : 'Paused'}
								</span>
							</td>
							<td>
								<button
									class="btn btn-sm variant-soft"
									on:click={() => toggleAutomationStatus(area)}
								>
									{area.active ? 'Pause' : 'Activate'}
								</button>
								<button class="btn btn-sm variant-soft ml-2" on:click={() => showAreaDetails(area._id)}>
									<Info class="w-4 h-4" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<div class="card variant-soft p-4">
		<h2 class="h2 mb-4">Activity Overview</h2>
		<div class="bg-surface-200 h-64 flex items-center justify-center">
			<BarChart2 class="w-12 h-12 text-surface-500" />
			<p class="ml-2">Activity chart will be displayed here</p>
		</div>
	</div>
</div>

{#if showDetailsPopup && selectedAreaId}
	<AreaDetailsPopup areaId={selectedAreaId} token={data.token}  on:close={closeDetailsPopup}/>
{/if}