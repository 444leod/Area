<script lang="ts">
	import { LogIn, UserPlus, LayoutDashboardIcon } from 'lucide-svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
</script>

<nav class="p-4 bg-surface-100-800-token">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="font-bold text-xl">Boogie's Area</a>
		<div class="space-x-4">
			<a href="/login" class="btn btn-hover variant-filled-primary">
				<span>
					<LogIn class="mr-2" size={18} />
				</span>
				<span> Login </span>
			</a>
			<a href="/signup" class="btn btn-hover variant-filled-primary">
				<UserPlus class="mr-2" size={18} />
				Sign Up
			</a>
			<a href="/dashboard" class="btn btn-hover variant-filled-primary">
				<LayoutDashboardIcon class="mr-2" size={18} />
				Dashboard
			</a>
		</div>
		<LightSwitch />
	</div>
</nav>
