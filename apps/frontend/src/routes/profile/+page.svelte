<script lang="ts">
	import { User, Mail, Box, LogOut, Zap } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data;
	const { profile } = data;

	let container;
	let gsap;
	let ScrollTrigger;

	async function handleLogout() {
		const response = await fetch('/api/logout', { method: 'POST' });
		if (response.ok) {
			goto('/login');
		}
	}

	function animateCard(event) {
		if (browser && gsap) {
			gsap.to(event.currentTarget, {
				scale: 1.05,
				boxShadow: '0 10px 20px rgb(var(--color-surface-500) / 0.2)',
				duration: 0.3
			});
		}
	}

	function resetCard(event) {
		if (browser && gsap) {
			gsap.to(event.currentTarget, {
				scale: 1,
				boxShadow: '0 4px 6px rgb(var(--color-surface-500) / 0.1)',
				duration: 0.3
			});
		}
	}
</script>

<div class="relative min-h-screen" bind:this={container}>
	<div class="container mx-auto px-4 py-12 relative z-10">
		<div class="max-w-4xl mx-auto">
			<h1 class="h1 mb-12 text-center">Your Profile</h1>

			<div class="card profile-card p-8 mb-12">
				<div class="flex flex-col md:flex-row items-center mb-8">
					<div
						class="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 md:mb-0 md:mr-8 shadow"
						aria-hidden="true"
					>
						{profile.first_name[0]}
					</div>
					<div class="text-center md:text-left">
						<h2 class="h2">{profile.first_name}</h2>
						<p class="text-surface-600-300-token">{profile.email}</p>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="profile-info flex items-center bg-surface-100-800-token rounded-lg p-4">
						<User class="w-8 h-8 text-primary-500 mr-4" aria-hidden="true" />
						<span>{profile.first_name}</span>
					</div>
					<div class="profile-info flex items-center bg-surface-100-800-token rounded-lg p-4">
						<Mail class="w-8 h-8 text-primary-500 mr-4" aria-hidden="true" />
						<span>{profile.email}</span>
					</div>
					<div class="profile-info flex items-center bg-surface-100-800-token rounded-lg p-4">
						<Box class="w-8 h-8 text-primary-500 mr-4" aria-hidden="true" />
						<span
							>{profile.areas.length > 1
								? `${profile.areas.length} Areas`
								: `${profile.areas.length} Area`}</span
						>
					</div>
				</div>
			</div>

			<h3 class="h3 areas-title mb-8 text-center">Your Areas</h3>

			{#each profile.areas as area, index (area._id)}
				<div
					class="area-card mb-6 card p-5"
					on:mouseenter={animateCard}
					on:mouseleave={resetCard}
					role="article"
					tabindex="0"
					aria-label={`Area: ${area.action.informations.type} to ${area.reaction.informations.type}`}
				>
					<div class="flex justify-between items-center mb-4">
						<h4 class="h4">{area.action.informations.type} → {area.reaction.informations.type}</h4>
						<span class="chip {area.active ? 'variant-filled-success' : 'variant-filled-error'}">
							{area.active ? 'Active' : 'Inactive'}
						</span>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="bg-surface-100-800-token rounded-lg p-4">
							<h5 class="h5 mb-2 flex items-center">
								<Zap class="w-5 h-5 mr-2 text-primary-500" aria-hidden="true" />
								Action
							</h5>
							<p><strong>Type:</strong> {area.action.informations.type}</p>
							{#if area.action.informations.exampleField}
								<p><strong>Example Field:</strong> {area.action.informations.exampleField}</p>
							{/if}
						</div>
						<div class="bg-surface-100-800-token rounded-lg p-4">
							<h5 class="h5 mb-2 flex items-center">
								<Zap class="w-5 h-5 mr-2 text-secondary-500" aria-hidden="true" />
								Reaction
							</h5>
							<p><strong>Type:</strong> {area.reaction.informations.type}</p>
							{#if area.reaction.informations.to}
								<p><strong>To:</strong> {area.reaction.informations.to}</p>
							{/if}
							{#if area.reaction.informations.subject}
								<p><strong>Subject:</strong> {area.reaction.informations.subject}</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}

			<div class="mt-12 flex justify-center">
				<button
					class="btn btn-hover variant-filled-error"
					color="error"
					size="lg"
					on:click={handleLogout}
				>
					<LogOut class="w-6 h-6 mr-3" aria-hidden="true" />
					Logout
				</button>
			</div>
		</div>
	</div>
</div>
