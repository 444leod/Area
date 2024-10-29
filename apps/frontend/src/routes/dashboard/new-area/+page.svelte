<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { areaStore } from '$lib/store/areaStore';
	import Icon from '@iconify/svelte';

	interface InfoCard {
		title: string;
		description: string;
		icon: string;
	}

	const infoCards: InfoCard[] = [
		{
			title: 'Choose Your Apps',
			description:
				'Select the apps you want to connect. Start with a trigger app that initiates your automation.',
			icon: 'mdi:apps'
		},
		{
			title: 'Configure Actions',
			description:
				'Define what happens and when. Set up your trigger conditions and resulting actions.',
			icon: 'mdi:cog'
		},
		{
			title: 'Activate & Go',
			description: 'Review your setup, activate your automation, and let it work for you.',
			icon: 'mdi:play-circle'
		}
	];

	onMount(() => {
		areaStore.reset();
	});

	async function startAreaCreation() {
		await goto('/dashboard/new-area/trigger-app');
	}
</script>

<div class="flex flex-col items-center gap-8 max-w-4xl mx-auto">
	<div class="text-center">
		<h3 class="h3 mb-4">
			Connect your favorite apps and automate your workflow in just a few steps.
		</h3>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
		{#each infoCards as card}
			<div class="card variant-soft p-6 flex flex-col items-center text-center gap-4">
				<Icon icon={card.icon} class="w-12 h-12 text-primary-500" />
				<h3 class="h3">{card.title}</h3>
				<p class="text-sm">{card.description}</p>
			</div>
		{/each}
	</div>

	<div class="flex flex-row items-center gap-4 mt-8">
		<a href="/dashboard" class="btn variant-soft-secondary">
			<Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" />
			Back to Dashboard
		</a>
		<button class="btn variant-filled-primary" on:click={startAreaCreation}>
			<Icon icon="mdi:plus" class="w-6 h-6 mr-2" />
			Start Creating
		</button>
	</div>

	<div class="card variant-ghost-secondary p-4 mt-8 w-full">
		<div class="flex items-start gap-4">
			<Icon icon="mdi:information" class="w-6 h-6 flex-shrink-0 text-primary-500" />
			<div>
				<h4 class="h4 mb-2">Need Help?</h4>
				<p class="text-sm">
					Check out our <a href="/docs" class="anchor">documentation</a> for guides and examples, or
					visit our <a href="/templates" class="anchor">templates</a> for pre-built automations.
				</p>
			</div>
		</div>
	</div>
</div>
