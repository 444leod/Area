<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getIconForApp } from '$lib/utils/getIconName';

	export let item: string;
	export let onClick: () => void;
	export let appName: string;
	export let description: string | undefined = undefined;
	export let type;
	const actionSpecificIcon = getActionSpecificIcon(item);
	$: iconName = actionSpecificIcon || getIconForApp(appName);

	function getActionSpecificIcon(actionName: string): string | undefined {
		const actionSpecificIcons: Record<string, string> = {
			'new issue': 'mdi:alert-circle',
			'new project': 'mdi:folder-plus',
			'new repository': 'mdi:source-repository',
			videoPosted: 'mdi:youtube',
			'each X second': 'mdi:timer-outline',
			'a pull request state has changed to the one selected': 'mdi:source-pull',
			sendemail: 'mdi:email-send',
			'send message': 'mdi:message-text',
			'Create new task': 'material-symbols:task-outline'
		};

		return actionSpecificIcons[actionName];
	}
</script>

<button
	class="card card-hover variant-soft-secondary flex items-center gap-4 p-4 shadow-md"
	on:click={onClick}
>
	<Icon icon={iconName} class="text-3xl text-primary opacity-80" width="48" height="48" />
	<div class="flex flex-col items-start w-full">
		<span class="text-base text-left md:text-lg font-semibold text-primary-dark">{item}</span>
		{#if description}
			<p class="mt-1 text-sm opacity-70 text-gray-600 pl-1 md:pl-2">{description}</p>
		{/if}
		<div class="mt-2 flex gap-3 pl-1 md:pl-2">
			<slot name="footer" />
		</div>
	</div>
</button>
