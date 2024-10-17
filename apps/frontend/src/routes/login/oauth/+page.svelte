<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import {authStore} from "$lib/store/authStore";

    let loading = true;
    let error = false;

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                });

                if (!response.ok) {
                    throw new Error('Failed to authenticate with Google');
                }
                const data = await response.json();
                document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
                loading = false;
                authStore.set(true);
                setTimeout(() => goto('/dashboard'), 1000);
            } catch (error) {
                console.error('Error during Google authentication:', error);
                loading = false;
                error = true;
                setTimeout(() => goto('/login?error=google_auth_failed'), 2000);
            }
        }
    });
</script>

<div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="text-center">
        {#if loading}
            <div in:fade="{{ duration: 300 }}" out:fade="{{ duration: 300 }}">
                <svg class="inline w-24 h-24 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-4 text-xl font-semibold">Authenticating...</p>
            </div>
        {:else if error}
            <div in:fade="{{ duration: 300 }}" class="text-error-500">
                <svg class="inline w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="mt-4 text-xl font-semibold">Authentication failed</p>
                <p class="mt-2">Redirecting to login page...</p>
            </div>
        {:else}
            <div in:fade="{{ duration: 300 }}" class="text-success-500">
                <svg class="inline w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="mt-4 text-xl font-semibold">Authentication successful</p>
                <p class="mt-2">Redirecting to dashboard...</p>
            </div>
        {/if}
    </div>
</div>