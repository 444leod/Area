<script lang="ts">
	import { LogIn, UserPlus, Menu, X, User, LogOut } from 'lucide-svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/store/authStore';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Fonction pour gérer la déconnexion
	async function logout() {
		try {
			const response = await fetch('/api/logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					console.log('Déconnexion réussie');
					authStore.logout(); // Met à jour le store
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

	// Vérification de l'authentification lors du montage du composant

</script>

<nav class="p-4 bg-surface-100-800-token">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="font-bold text-xl" data-testid="logo">Boogie's Area</a>

		<!-- Desktop Menu -->
		<div class="hidden md:flex items-center space-x-4" data-testid="desktop-menu">
			{#if $authStore}
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
				{#if $authStore}
					<a href="/profile" class="btn btn-sm btn-hover variant-filled-primary w-full justify-start" on:click={toggleMenu} data-testid="mobile-profile-button">
						<User class="mr-2" size={18} />
						Profile
					</a>
					<button on:click={() => { logout(); toggleMenu(); }} class="btn btn-sm btn-hover variant-filled-primary w-full justify-start" data-testid="mobile-logout-button">
						<LogOut class="mr-2" size={18} />
						Logout
					</button>
				{:else}
					<a href="/login" class="btn btn-sm btn-hover variant-filled-primary w-full justify-start" on:click={toggleMenu} data-testid="mobile-login-button">
						<LogIn class="mr-2" size={18} />
						Login
					</a>
					<a href="/signup" class="btn btn-sm btn-hover variant-filled-primary w-full justify-start" on:click={toggleMenu} data-testid="mobile-signup-button">
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
