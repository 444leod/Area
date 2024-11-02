<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Chart, registerables } from 'chart.js';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import type { PageData} from "./$types";
	export let data: PageData;

	console.log(data)

	Chart.register(...registerables);

	let userCount = 0;
	let automationCount = 0;
	let activeAutomationCount = 0;
	let selectedTab = 0;

	const mockData = {
		userGrowth: [100, 120, 150, 200, 250, 300, 350],
		automationsByService: {
			GitHub: 30,
			Gmail: 25,
			Slack: 20,
			Trello: 15,
			Discord: 10
		},
		recentAutomations: [
			{ name: 'GitHub Issue to Slack', status: 'active', createdAt: '2023-05-15' },
			{ name: 'Gmail to Trello Card', status: 'inactive', createdAt: '2023-05-14' },
			{ name: 'Slack Message to Discord', status: 'active', createdAt: '2023-05-13' }
		]
	};

	onMount(() => {
		animateCounters();
		createCharts();
	});

	function animateCounters() {
		const duration = 2000;
		const steps = 60;
		const userTarget = 350;
		const automationTarget = 500;
		const activeAutomationTarget = 350;

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

	function createCharts() {
		// User Growth Chart
		new Chart(document.getElementById('userGrowthChart') as HTMLCanvasElement, {
			type: 'line',
			data: {
				labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
				datasets: [
					{
						label: 'User Growth',
						data: mockData.userGrowth,
						borderColor: 'rgb(75, 192, 192)',
						tension: 0.1
					}
				]
			},
			options: {
				responsive: true,
				animations: {
					tension: {
						duration: 1000,
						easing: 'linear',
						from: 0,
						to: 0.3
					}
				}
			}
		});

		// Automations by Service Chart
		new Chart(document.getElementById('automationsByServiceChart') as HTMLCanvasElement, {
			type: 'doughnut',
			data: {
				labels: Object.keys(mockData.automationsByService),
				datasets: [
					{
						data: Object.values(mockData.automationsByService),
						backgroundColor: [
							'rgb(255, 99, 132)',
							'rgb(54, 162, 235)',
							'rgb(255, 206, 86)',
							'rgb(75, 192, 192)',
							'rgb(153, 102, 255)'
						]
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'right'
					}
				},
				animation: {
					animateScale: true,
					animateRotate: true
				}
			}
		});
	}
</script>

<main class="container mx-auto p-4 space-y-8">
	<strong class="h3 uppercase py-10 text-center">Welcome Admin user</strong>
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

	<div class="grid grid-cols-1 md:grid-cols-2 gap-8" in:fade={{ duration: 300, delay: 300 }}>
		<div class="card p-4 variant-ghost-secondary lg:h-[30rem]">
			<h3 class="h3 mb-4 text-center">User Growth</h3>
			<canvas id="userGrowthChart"></canvas>
		</div>
		<div class="card p-4 variant-ghost-secondary lg:h-[30rem] relative">
			<h3 class="h3 mb-4 text-center">Automations by Service</h3>
			<canvas class="lg:absolute left-0 right-0 mx-auto w-full" id="automationsByServiceChart"
			></canvas>
		</div>
	</div>

	<div class="card p-4 variant-ghost-secondary" in:fade={{ duration: 300, delay: 600 }}>
		<h3 class="h3 mb-4">Recent Automations</h3>

		<!-- Mobile view -->
		<div class="md:hidden space-y-4">
			{#each mockData.recentAutomations as automation}
				<div class="card p-4 variant-ghost">
					<h4 class="font-bold">{automation.name}</h4>
					<div class="flex justify-between items-center mt-2">
						<span
							class="badge {automation.status === 'active'
								? 'variant-filled-success'
								: 'variant-filled-error'}"
						>
							{automation.status}
						</span>
						<span class="text-sm">{automation.createdAt}</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Desktop view -->
		<div class="hidden md:block">
			<table class="table table-compact w-full">
				<thead>
					<tr>
						<th>Name</th>
						<th>Status</th>
						<th>Created At</th>
					</tr>
				</thead>
				<tbody>
					{#each mockData.recentAutomations as automation}
						<tr>
							<td>{automation.name}</td>
							<td>
								<span
									class="badge {automation.status === 'active'
										? 'variant-filled-success'
										: 'variant-filled-error'}"
								>
									{automation.status}
								</span>
							</td>
							<td>{automation.createdAt}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</main>
