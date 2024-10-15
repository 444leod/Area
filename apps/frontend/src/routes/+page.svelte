<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Rocket, Zap, Puzzle } from 'lucide-svelte';

	let visible = false;
	onMount(() => {
		visible = true;
	});

	// For testing purposes, we'll set visible to true if we're in a test environment
	if (import.meta.env.MODE === 'test') {
		visible = true;
	}

	// Integration marquee data
	const integrations = [
		{ name: 'Slack', logo: '🟣' },
		{ name: 'Gmail', logo: '📧' },
		{ name: 'Trello', logo: '🔷' },
		{ name: 'GitHub', logo: '🐱' },
		{ name: 'Dropbox', logo: '📦' },
		{ name: 'Twitter', logo: '🐦' },
		{ name: 'Spotify', logo: '🎵' },
		{ name: 'Zapier', logo: '⚡' },
		{ name: 'Discord', logo: '💬' },
		{ name: 'Notion', logo: '📝' },
		{ name: 'jira', logo: '🔧' },
		{ name: 'Salesforce', logo: '☁️' }
	];

	// Duplicate the integrations to create a seamless loop
	const marqueeItems = [...integrations, ...integrations];
</script>

<div class="container mx-auto px-4 py-12" data-testid="main-container">
	{#if visible}
		<h1 in:fly={{ y: -50, duration: 1000 }} class="h1 text-center p-5 text-primary-500">
			Welcome to the BoogieBomb Area !!!
		</h1>
		<p in:fade={{ delay: 500, duration: 1000 }} class="text-center text-xl mt-4 mb-8">
			Automate your workflow. Connect your apps. Boost your productivity.
		</p>
		<div class="flex justify-center space-x-4 mb-12">
			<button in:fly={{ x: -50, duration: 1000, delay: 1000 }} class="btn variant-filled-primary"
				>Get Started</button
			>
			<button in:fly={{ x: 50, duration: 1000, delay: 1000 }} class="btn variant-soft-secondary"
				>Learn More</button
			>
		</div>
		<div class="grid md:grid-cols-3 gap-8 mt-12">
			<div in:fade={{ duration: 1000, delay: 1500 }} class="card p-4 variant-soft">
				<Rocket class="w-12 h-12 mb-4 mx-auto text-primary-500" />
				<h2 class="h3 text-center mb-2">Powerful Automation</h2>
				<p class="text-center">
					Create complex workflows with ease. Connect multiple apps and automate your tasks.
				</p>
			</div>
			<div in:fade={{ duration: 1000, delay: 1700 }} class="card p-4 variant-soft">
				<Zap class="w-12 h-12 mb-4 mx-auto text-secondary-500" />
				<h2 class="h3 text-center mb-2">Lightning Fast</h2>
				<p class="text-center">
					Experience rapid execution of your automated tasks. Save time and increase efficiency.
				</p>
			</div>
			<div in:fade={{ duration: 1000, delay: 1900 }} class="card p-4 variant-soft">
				<Puzzle class="w-12 h-12 mb-4 mx-auto text-tertiary-500" />
				<h2 class="h3 text-center mb-2">Endless Possibilities</h2>
				<p class="text-center">
					Connect hundreds of apps and services. The only limit is your imagination.
				</p>
			</div>
		</div>
		<div in:fade={{ duration: 1000, delay: 2100 }} class="mt-16">
			<h2 class="h2 text-center mb-8">Integrate with Your Favorite Tools</h2>
			<div class="marquee-container overflow-hidden">
				<div class="marquee flex">
					{#each marqueeItems as integration, i (i)}
						<div class="flex-shrink-0 w-24 h-24 mx-4 flex flex-col items-center justify-center">
							<div class="text-4xl mb-2">{integration.logo}</div>
							<div class="text-center text-sm">{integration.name}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.marquee-container {
		mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
	}
	.marquee {
		animation: scroll 40s linear infinite;
	}
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>