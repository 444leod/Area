<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { oauthGoogle } from '$lib/modules/oauthGoogle';
	import { oauthAtlassian } from '$lib/modules/oauthAtlassian';
	import { oauthGithub } from '$lib/modules/oauthGithub';
	import { oauthSpotify } from '$lib/modules/oauthSpotify';
	import ServiceCard from '$lib/components/authorization/ServiceCard.svelte';
	import ServiceModal from '$lib/components/ServiceModal.svelte';
	import { Search } from 'lucide-svelte';

	export let data;

	let showModal = false;
	let selectedService = null;

	function getRelatedServices(serviceName: string) {
		const serviceMap = {
			Google: ['Google task', 'YouTube', 'Mail'],
			Atlassian: ['Atlassian'],
			Github: ['Github'],
			Spotify: ['Spotify'],
			Discord: ['Discord']
		};
		const relatedNames = serviceMap[serviceName] || [serviceName];
		const relatedServices = relatedNames
			.map((name) => data.services.find((s) => s.name === name))
			.filter(Boolean);
		return {
			actions: relatedServices.flatMap((s) => s.actions || []),
			reactions: relatedServices.flatMap((s) => s.reactions || [])
		};
	}

	const allServices = [
		{
			name: 'Google',
			description: 'Connect to use Google services (YouTube, Gmail, Tasks) in your automations',
			icon: 'devicon:google',
			oauthFunction: oauthGoogle,
			...getRelatedServices('Google')
		},
		{
			name: 'Atlassian',
			description: 'Connect to use Atlassian in your automations',
			icon: 'logos:atlassian',
			oauthFunction: oauthAtlassian,
			...getRelatedServices('Atlassian')
		},
		{
			name: 'Github',
			description: 'Connect to use Github in your automations',
			icon: 'logos:github-icon',
			oauthFunction: oauthGithub,
			...getRelatedServices('Github')
		},
		{
			name: 'Spotify',
			description: 'Connect to use Spotify in your automations',
			icon: 'logos:spotify-icon',
			oauthFunction: oauthSpotify,
			...getRelatedServices('Spotify')
		}
	];

	$: services = allServices.map((service) => ({
		...service,
		connected: data.authorizations.includes(service.name.toUpperCase())
	}));

	let searchTerm = '';
	let showConnected = true;
	let showDisconnected = true;

	$: filteredServices = services.filter(
		(service) =>
			service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			((showConnected && service.connected) || (showDisconnected && !service.connected))
	);

	function connectService(service) {
		service.oauthFunction();
	}

	async function disconnectService(service) {
		try {
			const formData = new FormData();
			formData.append('service', service.name);

			const response = await fetch('?/disconnect', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to disconnect service');
			}

			window.location.reload();
		} catch (err) {
			console.error('Error disconnecting service:', err);
		}
	}

	function openServiceModal(service) {
		selectedService = {
			...service,
			description: `${service.description}\n\nIncludes services: ${getRelatedServices(service.name)
				.relatedServices?.map((s) => s.name)
				.join(', ')}`
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedService = null;
	}
</script>

<div class="container mx-auto px-4 py-16" in:fade={{ duration: 300, easing: quintOut }}>
	<h1 class="h1 mb-8 text-center">Manage Your Service Connections</h1>
	<div class="flex flex-col md:flex-row justify-between items-center mb-8">
		<div
			class="input-group input-group-divider grid-cols-[auto_1fr_auto] w-full md:w-1/2 mb-4 md:mb-0"
		>
			<div class="input-group-shim"><Search size={20} /></div>
			<input type="search" placeholder="Search services..." bind:value={searchTerm} />
		</div>
		<div class="flex items-center space-x-4">
			<label class="flex items-center space-x-2">
				<input type="checkbox" class="checkbox" bind:checked={showConnected} />
				<span>Connected</span>
			</label>
			<label class="flex items-center space-x-2">
				<input type="checkbox" class="checkbox" bind:checked={showDisconnected} />
				<span>Disconnected</span>
			</label>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each filteredServices as service (service.name)}
			<div in:fly={{ y: 50, duration: 300, delay: 150, easing: quintOut }}>
				<ServiceCard
					name={service.name}
					description={service.description}
					icon={service.icon}
					connected={service.connected}
					onConnect={() => connectService(service)}
					onDisconnect={() => disconnectService(service)}
					onDetails={() => openServiceModal(service)}
				/>
			</div>
		{/each}
	</div>
</div>

<ServiceModal show={showModal} service={selectedService} onClose={closeModal} />
