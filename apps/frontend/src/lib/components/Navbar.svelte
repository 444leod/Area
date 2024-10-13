<script lang="ts">
	import { LogIn, UserPlus, Menu, X, User, LogOut } from 'lucide-svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	let isMenuOpen = false;
	let isAuthenticated = false;
	let token: string | null = null;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Fonction pour gérer la déconnexion
	async function logout() {
		try {
			const response = await fetch('/api/logout', {
				method: 'POST', // Envoie une requête POST à la route API
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					console.log('Déconnexion réussie');
					isAuthenticated = false;  // Mettre à jour l'état d'authentification côté client
				} else {
					console.log('Erreur lors de la déconnexion');
				}
			} else {
				console.error('Erreur lors de la requête de déconnexion');
			}
		} catch (error) {
			console.error('Erreur lors de la déconnexion :', error);
		}
	}

	// Appel à une API pour obtenir le token côté serveur
	async function fetchToken() {
		try {
			const response = await fetch('/api/get-token');
			if (response.ok) {
				const data = await response.json();
				token = data.token;

				if (token) {
					isAuthenticated = true;
					console.log('Token récupéré :', token);
				} else {
					console.log("Utilisateur non authentifié");
				}
			} else {
				console.log("Erreur lors de la récupération du token");
			}
		} catch (error) {
			console.error('Erreur lors de la requête :', error);
		}
	}

	// Initialisation lors du montage du composant
	onMount(() => {
		fetchToken(); // Récupérer le token à la montée du composant
	});
</script>



<nav class="p-4 bg-surface-100-800-token">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="font-bold text-xl" data-testid="logo">Boogie's Area</a>

		<!-- Desktop Menu -->
		<div class="hidden md:flex items-center space-x-4" data-testid="desktop-menu">
			{#if isAuthenticated}
				<a href="/profile" class="btn btn-sm btn-hover variant-filled-primary" data-testid="desktop-profile-button">
					<User class="mr-2" size={18} />
					<span class="hidden sm:inline"> Profile </span>
				</a>
				<button on:click={logout} class="btn btn-sm btn-hover variant-filled-primary" data-testid="desktop-logout-button">
					<LogOut class="mr-2" size={18} />
					<span class="hidden sm:inline"> Logout </span>
				</button>
			{:else}
				<a href="/login" class="btn btn-sm btn-hover variant-filled-primary" data-testid="desktop-login-button">
					<LogIn class="mr-2" size={18} />
					<span class="hidden sm:inline"> Login </span>
				</a>
				<a href="/signup" class="btn btn-sm btn-hover variant-filled-primary" data-testid="desktop-signup-button">
					<UserPlus class="mr-2" size={18} />
					<span class="hidden sm:inline"> Sign Up </span>
				</a>
			{/if}
			<LightSwitch data-testid="desktop-light-switch" />
		</div>

		<!-- Mobile Menu Button -->
		<button class="md:hidden btn btn-sm variant-ghost-surface" on:click={toggleMenu} data-testid="mobile-menu-button">
			{#if isMenuOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
	</div>
	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="md:hidden mt-4" transition:slide={{ duration: 300 }} data-testid="mobile-menu">
			<div class="flex flex-col space-y-2">
				{#if isAuthenticated}
					<a
							href="/profile"
							class="btn btn-sm btn-hover variant-filled-primary w-full justify-start"
							on:click={toggleMenu}
							data-testid="mobile-profile-button"
					>
						<User class="mr-2" size={18} />
						Profile
					</a>
					<button
							on:click={() => { logout(); toggleMenu(); }}
							class="btn btn-sm btn-hover variant-filled-primary w-full justify-start"
							data-testid="mobile-logout-button"
					>
						<LogOut class="mr-2" size={18} />
						Logout
					</button>
				{:else}
					<a
							href="/login"
							class="btn btn-sm btn-hover variant-filled-primary w-full justify-start"
							on:click={toggleMenu}
							data-testid="mobile-login-button"
					>
						<LogIn class="mr-2" size={18} />
						Login
					</a>
					<a
							href="/signup"
							class="btn btn-sm btn-hover variant-filled-primary w-full justify-start"
							on:click={toggleMenu}
							data-testid="mobile-signup-button"
					>
						<UserPlus class="mr-2" size={18} />
						Sign Up
					</a>
				{/if}
				<div class="flex items-center justify-between">
					<span>Theme</span>
					<LightSwitch data-testid="mobile-light-switch" />
				</div>
			</div>
		</div>
	{/if}
</nav>