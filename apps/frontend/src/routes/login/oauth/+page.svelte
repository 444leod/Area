<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google-callback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                });

                if (!response.ok) {
                    throw new Error('Failed to authenticate with Google');
                }

                const data = await response.json();

                // Store the token in a secure way (e.g., HttpOnly cookie)
                document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;

                goto('/dashboard');
            } catch (error) {
                console.error('Error during Google authentication:', error);
                goto('/login?error=google_auth_failed');
            }
        }
    });
</script>

<div>Processing Google authentication...</div>