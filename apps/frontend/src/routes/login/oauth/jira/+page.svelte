<script>
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";

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
                console.log("Error during token retrieving");
                return null
            }
        } catch (error) {
            console.error('Error during the request :', error);
            return null
        }
    }

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const token = await fetchToken()

        console.log("toke : ", token)
        if (code && token) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/jira`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ code }),
                });

                if (response.ok) {
                    const data = await response.json();
                    goto('/profile/authorization?success=1&service=jira');
                } else {
                    throw new Error(`Error during Auth`);
                }
            } catch (error) {
                console.error('Erreur:', error);
                goto('/profile/authorization?success=0&service=jira');
            }
        } else {
            console.error('No token received');
            goto('/profile/authorization?success=0&service=jira');
        }
    });
</script>

<div>
    Traitement de l'authentification Jira...
</div>
