<script>
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';
</script>

<div class="flex flex-col items-center justify-center h-64" in:fly={{ y: 50, duration: 500 }}>
	<Icon icon="mdi:check-circle" class="w-24 h-24 text-success mb-4" />
	<h2 class="h2 text-center text-success">Automation Created Successfully!</h2>
	<p class="mt-2">Redirecting to Dashboard...</p>
</div>
