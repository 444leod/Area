<script lang="ts">
	import { LogIn, UserPlus, Menu, X, User, LogOut, LayoutDashboard, KeyRound } from 'lucide-svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import { authStore } from '$lib/store/authStore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setError } from '$lib/store/errorMessage';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	async function logout() {
		try {
			const response = await fetch('/api/logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});
			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					authStore.set(false);
					goto('/login');
				}
			} else {
				const error = await response.json();
				setError(error.message);
			}
		} catch (error) {
			setError(error?.message);
		}
	}

	async function checkAuthStatus() {
		try {
			const response = await fetch('/api/auth');
			if (response.ok) {
				const { isAuthenticated } = await response.json();
				authStore.set(isAuthenticated);
			} else {
				console.error('Error fetching auth status');
			}
		} catch (error) {
			console.error('Error checking auth status:', error);
		}
	}

	onMount(() => {
		checkAuthStatus();
	});
</script>

<nav class="p-4 bg-opacity-30 bg-white">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="font-bold text-xl" data-testid="logo">Boogie's Area</a>

		<div class="hidden md:flex items-center space-x-4" data-testid="desktop-menu">
			{#if $authStore}
				<a
					href="/profile"
					class="btn btn-sm btn-hover variant-filled-primary"
					data-testid="desktop-profile-button"
				>
					<User class="mr-2" size={18} />
					<span class="hidden sm:inline"> Profile </span>
				</a>
				<a
					href="/dashboard"
					class="btn btn-sm btn-hover variant-filled-primary"
					data-testid="desktop-dashboard-button"
				>
					<LayoutDashboard class="mr-2" size={18} />
					<span class="hidden sm:inline"> Dashboard </span>
				</a>
				<a
					href="/profile/authorization"
					class="btn btn-sm btn-hover variant-filled-primary"
					data-testid="desktop-dashboard-button"
				>
					<KeyRound class="mr-2" size={18} />
					<span class="hidden sm:inline"> Authorizations </span>
				</a>
				<button
					on:click={logout}
					class="btn btn-sm btn-hover variant-filled-primary"
					data-testid="desktop-logout-button"
				>
					<LogOut class="mr-2" size={18} />
					<span class="hidden sm:inline"> Logout </span>
				</button>
			{:else}
				<a
					href="/login"
					class="btn btn-sm btn-hover variant-filled-primary"
					data-testid="desktop-login-button"
				>
					<LogIn class="mr-2" size={18} />
					<span class="hidden sm:inline"> Login </span>
				</a>
				<a
					href="/signup"
					class="btn btn-sm btn-hover variant-filled-primary"
					data-testid="desktop-signup-button"
				>
					<UserPlus class="mr-2" size={18} />
					<span class="hidden sm:inline"> Sign Up </span>
				</a>
			{/if}
			<LightSwitch data-testid="desktop-light-switch" />
		</div>
		<button
			class="md:hidden btn btn-sm variant-ghost-surface"
			on:click={toggleMenu}
			data-testid="mobile-menu-button"
		>
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
					<a
						href="/profile"
						class="btn btn-sm btn-hover variant-filled-primary w-full justify-start"
						on:click={toggleMenu}
						data-testid="mobile-profile-button"
					>
						<User class="mr-2" size={18} />
						Profile
					</a>
					<a
						href="/dashboard"
						class="btn btn-sm btn-hover variant-filled-primary w-full justify-start"
						on:click={toggleMenu}
						data-testid="mobile-dashboard-button"
					>
						<LayoutDashboard class="mr-2" size={18} />
						Dashboard
					</a>
					<button
						on:click={() => {
							logout();
							toggleMenu();
						}}
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
