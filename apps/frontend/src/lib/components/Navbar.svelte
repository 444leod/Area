<script lang="ts">
	import { LogIn, UserPlus } from 'lucide-svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
</script>

<nav class="p-4 bg-surface-100-800-token">
	<div class="container mx-auto flex justify-between items-center">
		<div class="font-bold text-xl">My App</div>
		<div class="space-x-4">
			<button class="btn btn-hover variant-filled-primary">
				<span>
					<LogIn class="mr-2" size={18} />
				</span>
				<span> Login </span>
			</button>
			<button class="btn btn-hover variant-filled-primary">
				<UserPlus class="mr-2" size={18} />
				Sign Up
			</button>
		</div>
		<LightSwitch />
	</div>
</nav>
