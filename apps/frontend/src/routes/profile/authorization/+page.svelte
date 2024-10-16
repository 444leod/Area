<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { oauthGoogle } from "$lib/modules/oauthGoogle";
    import { oauthJira } from "$lib/modules/oauthJira";
    import { oauthGithub } from "$lib/modules/oauthGithub";
    import { Modal, getModalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings } from '@skeletonlabs/skeleton';
    import ServiceCard from '$lib/components/authorization/ServiceCard.svelte';
    import { Search, Filter } from 'lucide-svelte';

    export let data;

    const modalStore = getModalStore();
    const allServices = [
        {
            name: "Google",
            description: "Connect to use Google services in your automations",
            icon: "devicon:google",
            oauthFunction: oauthGoogle
        },
        {
            name: "Jira",
            description: "Connect to use Jira in your automations",
            icon: "logos:jira",
            oauthFunction: oauthJira
        },
        {
            name: "Github",
            description: "Connect to use Github in your automations",
            icon: "logos:github-icon",
            oauthFunction: oauthGithub
        }
    ];

    $: services = allServices.map(service => ({
        ...service,
        connected: data.authorizations.includes(service.name.toUpperCase())
    }));

    let searchTerm = '';
    let showConnected = true;
    let showDisconnected = true;

    $: filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        ((showConnected && service.connected) || (showDisconnected && !service.connected))
    );

    function connectService(service) {
        service.oauthFunction();
    }

    function disconnectService(service) {
        console.log(`Disconnecting ${service.name}`);
        // Implement actual disconnect logic here
    }

    function openServiceModal(service) {
        const modal: ModalSettings = {
            type: 'alert',
            title: `${service.name} Details`,
            body: `
                <div class="p-4">
                    <p>${service.description}</p>
                    <p class="mt-4"><strong>Status:</strong> ${service.connected ? 'Connected' : 'Not Connected'}</p>
                </div>
            `,
            buttonTextConfirm: 'Close',
            modalClasses: 'w-modal shadow-xl',
            backdropClasses: 'bg-surface-500/30'
        };
        modalStore.trigger(modal);
    }
</script>

<div class="container mx-auto px-4 py-16" in:fade="{{ duration: 300, easing: quintOut }}">
    <h1 class="h1 mb-8 text-center">Manage Your Service Connections</h1>

    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] w-full md:w-1/2 mb-4 md:mb-0">
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
            <div in:fly="{{ y: 50, duration: 300, delay: 150, easing: quintOut }}">
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

<Modal />