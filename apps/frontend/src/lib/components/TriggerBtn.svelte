<script lang="ts">
	export let item: string;
	export let type: 'trigger' | 'action';
	export let onClick: () => void;
</script>

<button
	class="btn variant-soft flex items-center justify-start p-4 h-auto text-left"
	on:click={onClick}
>
	<span class="text-xl md:text-2xl mr-2 md:mr-4">{type === 'trigger' ? '🔔' : '🎬'}</span>
	<span class="text-sm md:text-base">{item}</span>
</button>
