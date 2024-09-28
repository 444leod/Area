<script>
	import { Zap, PlusCircle, Settings, BarChart2 } from 'lucide-svelte';

	let automations = [
		{ id: 1, name: 'New Email to Slack', status: 'active', runs: 152, lastRun: '2h ago' },
		{ id: 2, name: 'GitHub Issues to Trello', status: 'active', runs: 89, lastRun: '5m ago' },
		{ id: 3, name: 'Twitter Mentions to Discord', status: 'paused', runs: 367, lastRun: '1d ago' },
		{ id: 4, name: 'New Dropbox File to Gmail', status: 'active', runs: 56, lastRun: '30m ago' }
	];

	let stats = {
		totalAutomations: 4,
		activeAutomations: 3,
		totalRuns: 664,
		successRate: '99.5%'
	};

	function toggleAutomationStatus(id) {
		automations = automations.map((auto) =>
			auto.id === id ? { ...auto, status: auto.status === 'active' ? 'paused' : 'active' } : auto
		);
	}

	// Reactive declaration to determine if we're on a small screen
	$: isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;

	// Function to handle window resize
	function handleResize() {
		isSmallScreen = window.innerWidth < 640;
	}
</script>

<svelte:window on:resize={handleResize} />

<div class="container mx-auto px-4 py-8">
	<h1 class="h1 mb-8">Dashboard</h1>

	<!-- Quick Stats -->
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

	<!-- Automations List -->
	<div class="card variant-soft p-4 mb-8">
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
			<h2 class="h2 mb-2 sm:mb-0">Your Automations</h2>
			<a href="/dashboard/new-area" class="btn variant-filled-primary w-full sm:w-auto">
				<PlusCircle class="w-4 h-4 mr-2" />
				New Automation
			</a>
		</div>

		{#if isSmallScreen}
			<!-- Card view for small screens -->
			<div class="space-y-4">
				{#each automations as auto}
					<div class="card p-4 variant-soft">
						<h3 class="font-bold mb-2">{auto.name}</h3>
						<div class="flex justify-between items-center mb-2">
							<span
								class="badge {auto.status === 'active'
									? 'variant-filled-success'
									: 'variant-filled-warning'}"
							>
								{auto.status}
							</span>
							<span>Runs: {auto.runs}</span>
						</div>
						<div class="flex justify-between items-center mb-4">
							<span>Last Run: {auto.lastRun}</span>
						</div>
						<div class="flex justify-between">
							<button
								class="btn btn-sm variant-soft"
								on:click={() => toggleAutomationStatus(auto.id)}
							>
								{auto.status === 'active' ? 'Pause' : 'Activate'}
							</button>
							<button class="btn btn-sm variant-soft">
								<Settings class="w-4 h-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Table view for larger screens -->
			<table class="table table-compact table-hover">
				<thead>
					<tr>
						<th>Name</th>
						<th>Status</th>
						<th>Runs</th>
						<th>Last Run</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each automations as auto}
						<tr>
							<td>{auto.name}</td>
							<td>
								<span
									class="badge {auto.status === 'active'
										? 'variant-filled-success'
										: 'variant-filled-warning'}"
								>
									{auto.status}
								</span>
							</td>
							<td>{auto.runs}</td>
							<td>{auto.lastRun}</td>
							<td>
								<button
									class="btn btn-sm variant-soft"
									on:click={() => toggleAutomationStatus(auto.id)}
								>
									{auto.status === 'active' ? 'Pause' : 'Activate'}
								</button>
								<button class="btn btn-sm variant-soft ml-2">
									<Settings class="w-4 h-4" />
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
