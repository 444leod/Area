<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getIconForApp } from '$lib/utils/getIconName';

	export let item: string;
	export let onClick: () => void;
	export let appName: string;
	export let description: string | undefined = undefined;
	export let type;
	$: iconName = getIconForApp(appName);
</script>

<button
	class="card card-hover variant-soft-secondary flex items-center gap-4 p-4 shadow-md"
	on:click={onClick}
>
	<Icon icon={iconName} class="text-3xl " width="48" height="48" />
	<div class="flex flex-col items-start w-full">
		<span class="text-base text-left md:text-lg font-semibold text-primary-dark">{item}</span>
		{#if description}
			<p class="mt-1 text-sm opacity-70 text-primary-800-100-token">{description}</p>
		{/if}
		<div class="mt-2 flex gap-3">
			<slot name="footer" />
		</div>
	</div>
</button>
