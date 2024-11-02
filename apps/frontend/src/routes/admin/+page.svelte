<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Chart, registerables } from 'chart.js';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';

	import type { PageData } from './$types';
	export let data: PageData;
	const { user_count, areas_count, popular_actions, popular_reactions } = data.adminData;

	const mostUsedActions = Object.keys(popular_actions).map((name) => ({
		name,
		number: popular_actions[name]
	})).sort((a, b) => b.number - a.number);

	const mostUsedReactions = Object.keys(popular_reactions).map((name) => ({
		name,
		number: popular_reactions[name]
	})).sort((a, b) => b.number - a.number);

	Chart.register(...registerables);

	let userCount = 0;
	let automationCount = 0;
	let activeAutomationCount = 0;

	onMount(() => {
		animateCounters();
	});

	function animateCounters() {
		const duration = 2000;
		const steps = 60;
		const userTarget = user_count;
		const automationTarget = areas_count;
		const activeAutomationTarget = areas_count;

		const userIncrement = userTarget / steps;
		const automationIncrement = automationTarget / steps;
		const activeAutomationIncrement = activeAutomationTarget / steps;

		const interval = setInterval(() => {
			userCount += userIncrement;
			automationCount += automationIncrement;
			activeAutomationCount += activeAutomationIncrement;

			if (userCount >= userTarget) {
				userCount = userTarget;
				automationCount = automationTarget;
				activeAutomationCount = activeAutomationTarget;
				clearInterval(interval);
			}
		}, duration / steps);
	}

</script>

<main class="container mx-auto p-4 space-y-8">
	<strong class="h3 uppercase py-10 text-center">Admin Dashboard</strong>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4" in:fade={{ duration: 300 }}>
		<div
				class="card p-4 variant-ghost-secondary flex items-center"
				in:fly={{ y: 50, duration: 300, delay: 0 }}
		>
			<Icon icon="mdi:account-group" width="48" height="48" class="mr-4" />
			<div>
				<h3 class="h3">Total Users</h3>
				<p class="text-3xl font-bold">{Math.round(userCount)}</p>
			</div>
		</div>
		<div
				class="card p-4 variant-ghost-secondary flex items-center"
				in:fly={{ y: 50, duration: 300, delay: 100 }}
		>
			<Icon icon="mdi:robot" width="48" height="48" class="mr-4" />
			<div>
				<h3 class="h3">Total Automations</h3>
				<p class="text-3xl font-bold">{Math.round(automationCount)}</p>
			</div>
		</div>
		<div
				class="card p-4 variant-ghost-secondary flex items-center"
				in:fly={{ y: 50, duration: 300, delay: 200 }}
		>
			<Icon icon="mdi:robot-excited" width="48" height="48" class="mr-4" />
			<div>
				<h3 class="h3">Active Automations</h3>
				<p class="text-3xl font-bold">{Math.round(activeAutomationCount)}</p>
			</div>
		</div>
	</div>

	<div class="card p-4 variant-ghost-secondary" in:fade={{ duration: 300, delay: 600 }}>
		<h3 class="h3 mb-4">Popular Automations</h3>

		<!-- Mobile view -->
		<div class="md:hidden space-y-4 mb-4">
			<div class="card p-4 variant-ghost mb-4">
				<h4 class="font-bold">Actions</h4>
				<div class="space-y-2 mt-2">
					{#each mostUsedActions as automation}
						<div class="flex justify-between items-center">
							<span>{automation.name}</span>
							<span class="text-sm">{automation.number}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Reactions Section -->
			<div class="card p-4 variant-ghost">
				<h4 class="font-bold">Reactions</h4>
				<div class="space-y-2 mt-2">
					{#each mostUsedReactions as automation}
						<div class="flex justify-between items-center">
							<span>{automation.name}</span>
							<span class="text-sm">{automation.number}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Desktop view -->
		<div class="hidden md:block mb-4">
			<table class="table table-compact w-full">
				<thead>
				<tr>
					<th>Actions</th>
					<th class="text-right">Total</th>
				</tr>
				</thead>
				<tbody>
				{#each mostUsedActions as automation}
					<tr>
						<td>{automation.name}</td>
						<td class="text-right">{automation.number}</td>
					</tr>
				{/each}
				</tbody>
			</table>
		</div>

		<div class="hidden md:block">
			<table class="table table-compact w-full">
				<thead>
				<tr>
					<th>Reactions</th>
					<th class="text-right">Total</th>
				</tr>
				</thead>
				<tbody>
				{#each mostUsedReactions as automation}
					<tr>
						<td>{automation.name}</td>
						<td class="text-right">{automation.number}</td>
					</tr>
				{/each}
				</tbody>
			</table>
		</div>

	</div>
</main>