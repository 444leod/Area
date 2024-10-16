<script lang="ts">
    import { onMount } from 'svelte';
    import { oauthGoogle } from "$lib/modules/oauthGoogle";
    import { oauthJira } from "$lib/modules/oauthJira";
    import {authorizationGoogle} from "$lib/modules/authorizationGoogle";
    import ServiceCard from '$lib/components/authorization/ServiceCard.svelte';

    let gsap;
    let googleConnected = false;
    let jiraConnected = false;

    const googleIcon = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
    `;

    const jiraIcon = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 1-1.005-1.005zM12.577 0H5.234a5.218 5.218 0 0 0-5.234 5.215v6.299h11.578a1.005 1.005 0 0 1 1.005-1.005V0zM24 8.035v10.495a5.417 5.417 0 0 1-5.428 5.428h-4.844v-6.851l.021-.02a2.992 2.992 0 0 0 .88-2.113V0h3.943A5.417 5.417 0 0 1 24 5.429v2.606z" fill="#2684FF"/>
        </svg>
    `;

    onMount(async () => {
        const gsapModule = await import('gsap');
        gsap = gsapModule.default;

        animateCards();
    });

    function animateCards() {
        gsap.from('.service-card', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: 'power3.out'
        });
    }

    function handleGoogleAuth() {
        authorizationGoogle();
        // In a real scenario, you'd want to wait for the OAuth process to complete
        // before setting this to true. This is just for demonstration.
        googleConnected = true;
    }

    function handleJiraAuth() {
        oauthJira();
        // Same note as above
        jiraConnected = true;
    }
</script>

<div class="container mx-auto px-4 py-16">
    <h1 class="h1 mb-12 text-center">Connect Your Services</h1>

    <div class="space-y-12 max-w-4xl mx-auto">
        <ServiceCard
                name="Google"
                description="Connect to use Google services in your automations"
                icon={googleIcon}
                connected={googleConnected}
                onConnect={handleGoogleAuth}
                buttonColor="variant-filled-primary"
        />

        <ServiceCard
                name="Jira"
                description="Connect to use Jira in your automations"
                icon={jiraIcon}
                connected={jiraConnected}
                onConnect={handleJiraAuth}
                buttonColor="variant-filled-tertiary"
        />
    </div>
</div>