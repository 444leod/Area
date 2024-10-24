<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setError } from '$lib/store/errorMessage';

	async function fetchToken() {
		try {
			const response = await fetch('/api/get-token');
			if (response.ok) {
				const data = await response.json();
				const token = data.token;

				if (token) {
					return token;
				} else {
					return null;
				}
			} else {
				setError('Error during token retrieving');
				return null;
			}
		} catch (error) {
			setError(error);
			return null;
		}
	}

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const token = await fetchToken();

		if (code && token) {
			try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/github`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
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

<div>Traitement de l'authentification google...</div>
