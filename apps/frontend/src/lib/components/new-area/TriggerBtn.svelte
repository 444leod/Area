<script lang="ts">
	import Icon from '@iconify/svelte';

	export let item: string;
	export let type: 'trigger' | 'action';
	export let onClick: () => void;
	export let appName: string;

	function getIconForApp(appName: string, type: 'trigger' | 'action'): string {
		const iconMap: Record<string, Record<string, string>> = {
			'Google': {
				trigger: 'logos:google-icon',
				action: 'logos:google-icon'
			},
			'Gmail': {
				trigger: 'logos:google-gmail',
				action: 'logos:google-gmail'
			},
			'Google Drive': {
				trigger: 'logos:google-drive',
				action: 'logos:google-drive'
			},
			'Google Calendar': {
				trigger: 'logos:google-calendar',
				action: 'logos:google-calendar'
			},
			'Google Task': {
				trigger: 'logos:google-tasks',
				action: 'logos:google-tasks'
			},
			'GitHub': {
				trigger: 'logos:github-icon',
				action: 'logos:github-icon'
			},
			'Atlassian': {
				trigger: 'logos:jira',
				action: 'logos:jira'
			},
		};

		const defaultIcons = {
			trigger: 'mdi:bell-outline',
			action: 'mdi:play-circle-outline'
		};

		return (iconMap[appName] && iconMap[appName][type]) || defaultIcons[type];
	}

	$: iconName = getIconForApp(appName, type);
</script>

<button
		class="btn variant-soft flex items-center justify-start p-4 h-auto text-left"
		on:click={onClick}
>
	<Icon
			icon={iconName}
			class="text-2xl md:text-3xl mr-2 md:mr-4"
			width="24"
			height="24"
	/>
	<span class="text-sm md:text-base">{item}</span>
</button>