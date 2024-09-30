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
		<a href="/" class="font-bold text-xl">Boogie's Area</a>

		<!-- Desktop Menu -->
		<div class="hidden md:flex items-center space-x-4">
			<a href="/login" class="btn btn-sm btn-hover variant-filled-primary">
				<LogIn class="mr-2" size={18} />
				<span class="hidden sm:inline"> Login </span>
			</a>
			<a href="/signup" class="btn btn-sm btn-hover variant-filled-primary">
				<UserPlus class="mr-2" size={18} />
				<span class="hidden sm:inline"> Sign Up </span>
			</a>
			<a href="/dashboard" class="btn btn-sm btn-hover variant-filled-primary">
				<LayoutDashboardIcon class="mr-2" size={18} />
				<span class="hidden sm:inline"> Dashboard </span>
			</a>
			<LightSwitch />
		</div>

		<!-- Mobile Menu Button -->
		<button class="md:hidden btn btn-sm variant-ghost-surface" on:click={toggleMenu}>
			{#if isMenuOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
	</div>
	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="md:hidden mt-4" transition:slide={{ duration: 300 }}>
			<div class="flex flex-col space-y-2">
				<a
					href="/login"
					class="btn btn-sm btn-hover variant-filled-primary w-full justify-start"
					on:click={toggleMenu}
				>
					<LogIn class="mr-2" size={18} />
					Login
				</a>
				<a
					href="/signup"
					class="btn btn-sm btn-hover variant-filled-primary w-full justify-start"
					on:click={toggleMenu}
				>
					<UserPlus class="mr-2" size={18} />
					Sign Up
				</a>
				<a
					href="/dashboard"
					class="btn btn-sm btn-hover variant-filled-primary w-full justify-start"
					on:click={toggleMenu}
				>
					<LayoutDashboardIcon class="mr-2" size={18} />
					Dashboard
				</a>
				<div class="flex items-center justify-between">
					<span>Theme</span>
					<LightSwitch />
				</div>
			</div>
		</div>
	{/if}
</nav>
