<script lang="ts">
	import { fly } from 'svelte/transition';

	export let app: { id: number; name: string; icon: string };
	export let onClick: () => void;
</script>

<div
	in:fly={{ y: 50, duration: 300, delay: app.id * 50 }}
	class="card variant-soft-hover cursor-pointer transition-all duration-200 hover:scale-105"
	on:click={onClick}
>
	<header class="card-header flex justify-center items-center h-16 md:h-24">
		<span class="text-3xl md:text-4xl">{app.icon}</span>
	</header>
	<section class="p-2 md:p-4 text-center">
		<h3 class="text-sm md:text-base">{app.name}</h3>
	</section>
</div>
