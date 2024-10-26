<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getIconForApp } from '$lib/utils/getIconName';

	export let item: string;
	export let type: 'trigger' | 'action';
	export let onClick: () => void;
	export let appName: string;
	export let description: string | undefined = undefined;

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
	class="btn variant-soft flex flex-col items-start p-4 h-auto text-left hover:variant-soft-primary transition-colors duration-200 w-full"
	on:click={onClick}
>
	<div class="flex items-center w-full">
		<Icon icon={iconName} class="text-2xl md:text-3xl mr-2 md:mr-4" width="24" height="24" />
		<span class="text-sm md:text-base">{item}</span>
	</div>

	{#if description}
		<p class="mt-2 text-sm opacity-70 pl-10">{description}</p>
	{/if}

	<div class="mt-3 pl-10 flex gap-2">
		<slot name="footer" />
	</div>
</button>
