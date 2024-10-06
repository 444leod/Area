<script lang="ts">
	import { LogIn, UserPlus, LayoutDashboardIcon, Menu, X } from 'lucide-svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}


</script>

<nav class="p-4 bg-surface-100-800-token">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="font-bold text-xl" data-testid="logo">Boogie's Area</a>

		<!-- Desktop Menu -->
		<div class="hidden md:flex items-center space-x-4" data-testid="desktop-menu">
			<a href="/login" class="btn btn-sm btn-hover variant-filled-primary" data-testid="desktop-login-button">
				<LogIn class="mr-2" size={18} />
				<span class="hidden sm:inline"> Login </span>
			</a>
			<a href="/signup" class="btn btn-sm btn-hover variant-filled-primary" data-testid="desktop-signup-button">
				<UserPlus class="mr-2" size={18} />
				<span class="hidden sm:inline"> Sign Up </span>
			</a>
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
				<div class="flex items-center justify-between">
					<span>Theme</span>
					<LightSwitch data-testid="mobile-light-switch" />
				</div>
			</div>
		</div>
	{/if}
</nav>