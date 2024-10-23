<script>
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";
    import { setError } from "$lib/store/errorMessage";

    async function fetchToken() {
        try {
            const response = await fetch('/api/get-token');
            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                if (token) {
                    return token;
                } else {
                    return null
                }
            } else {
                return null
            }
        } catch (error) {
            setError(error);
            return null
        }
    }

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const token = await fetchToken()

        if (code && token) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/discord`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ code }),
                });
                if (response.ok) {
                    goto('/profile/authorization?success=1&service=discord');
                } else {
                    throw new Error(`Error during Auth`);
                }
            } catch (error) {
                setError(error);
                goto('/profile/authorization?success=0&service=discord');
            }
        } else {
            goto('/profile/authorization?success=0&service=discord');
        }
    });
</script>

<div>
    Traitement de l'authentification Atlassian...
</div>
