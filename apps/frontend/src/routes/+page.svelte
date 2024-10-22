<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Rocket, Zap, Puzzle } from 'lucide-svelte';
	import Icon from '@iconify/svelte';

	let visible = false;
	onMount(() => {
		visible = true;
	});

	if (import.meta.env.MODE === 'test') {
		visible = true;
	}

	const services = [
		{
			name: 'Google',
			icon: 'logos:google',
			description: 'Access Google services'
		},
		{
			name: 'Google Tasks',
			icon: 'gg:google-tasks',
			description: 'Manage your tasks'
		},
		{
			name: 'YouTube',
			icon: 'logos:youtube-icon',
			description: 'Video platform integration'
		},
		{
			name: 'Spotify',
			icon: 'logos:spotify-icon',
			description: 'Music streaming service'
		},
		{
			name: 'Timer',
			icon: 'mdi:timer-outline',
			description: 'Schedule your automations'
		},
		{
			name: 'Email',
			icon: 'logos:google-gmail',
			description: 'Send and receive emails'
		},
		{
			name: 'GitHub',
			icon: 'logos:github-icon',
			description: 'Version control integration'
		},
		{
			name: 'Atlassian',
			icon: 'logos:atlassian',
			description: 'Project management tools'
		},
		{
			name: 'Jira',
			icon: 'logos:jira',
			description: 'Issue tracking'
		},
		{
			name: 'Discord',
			icon: 'logos:discord-icon',
			description: 'Chat and community'
		},
		{
			name: 'Last.fm',
			icon: 'simple-icons:lastdotfm',
			description: 'Music tracking'
		}
	];

	// Double the array for seamless infinite scroll
	const marqueeServices = [...services, ...services];
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
			<a href="/dashboard" in:fly={{ x: -50, duration: 1000, delay: 1000 }} class="btn variant-filled-primary">
				Get Started
			</a>
			<a href="/login" in:fly={{ x: 50, duration: 1000, delay: 1000 }} class="btn variant-soft-secondary">
				Login
			</a>
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
			<h2 class="h2 text-center mb-8">Our Integrations</h2>
			<div class="marquee-container overflow-hidden mb-16">
				<div class="marquee flex">
					{#each marqueeServices as service, i (i)}
						<div class="flex-shrink-0 w-32 h-32 mx-4 flex flex-col items-center justify-center hover:scale-110 transition-transform duration-200">
							<Icon icon={service.icon} width="48" height="48" class="mb-2" />
							<div class="text-center text-sm font-semibold">{service.name}</div>
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
		animation: scroll 20s linear infinite;
	}
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	/* Add hover pause effect */
	.marquee-container:hover .marquee {
		animation-play-state: paused;
	}
</style>