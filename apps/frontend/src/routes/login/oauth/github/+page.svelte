<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setError } from '$lib/store/errorMessage';

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			try {
                const response = await fetch('/api/auth/oauth/github', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code })
                });

				if (response.ok) {
					await response.json();
					goto('/profile/authorization?success=1&service=github');
				} else {
					throw new Error(`Error during Auth`);
				}
			} catch (error) {
				setError(error);
				goto('/profile/authorization?success=0&service=github');
			}
		} else {
			console.error('No token received');
			goto('/profile/authorization?success=0&service=github');
		}
	});
</script>

<div>Traitement de l'authentification github...</div>
