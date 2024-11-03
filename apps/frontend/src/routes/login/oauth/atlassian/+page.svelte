<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setError } from '$lib/store/errorMessage';

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		if (code) {
			try {
				const response = await fetch('/api/auth/oauth/atlassian', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ code })
				});
				if (response.ok) {
					goto('/profile/authorization?success=1&service=atlassian');
				} else {
					throw new Error(`Error during Auth`);
				}
			} catch (error) {
				setError(error);
				goto('/profile/authorization?success=0&service=atlassian');
			}
		} else {
			goto('/profile/authorization?success=0&service=atlassian');
		}
	});
</script>

<div>Traitement de l'authentification Atlassian...</div>
