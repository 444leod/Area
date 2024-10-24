<script lang="ts">
	import Icon from '@iconify/svelte';

	export let item: string;
	export let type: 'trigger' | 'action';
	export let onClick: () => void;
	export let appName: string;

	function getIconForApp(appName: string, type: 'trigger' | 'action'): string {
		const iconMap: Record<string, Record<string, string>> = {
			Google: {
				trigger: 'logos:google-icon',
				action: 'logos:google-icon'
			},
			Gmail: {
				trigger: 'logos:google-gmail',
				action: 'logos:google-gmail'
			},
			'Google Task': {
				trigger: 'mdi:clipboard-check-outline',
				action: 'mdi:clipboard-plus-outline'
			},
			YouTube: {
				trigger: 'logos:youtube-icon',
				action: 'logos:youtube-icon'
			},
			Spotify: {
				trigger: 'logos:spotify-icon',
				action: 'logos:spotify-icon'
			},
			Timer: {
				trigger: 'mdi:timer',
				action: 'mdi:timer-cog'
			},
			Mail: {
				trigger: 'mdi:email-alert',
				action: 'mdi:email-send'
			},
			Discord: {
				trigger: 'logos:discord-icon',
				action: 'logos:discord-icon'
			},
			Atlassian: {
				trigger: 'logos:atlassian',
				action: 'logos:atlassian'
			},
			GitHub: {
				trigger: 'logos:github-icon',
				action: 'logos:github-icon'
			},
			LastFM: {
				trigger: 'logos:lastfm',
				action: 'logos:lastfm'
			}
		};
		//TODO complete with new actions and reactions
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

		if (actionSpecificIcons[item]) {
			return actionSpecificIcons[item];
		}
		if (iconMap[appName] && iconMap[appName][type]) {
			return iconMap[appName][type];
		}

		const defaultIcons = {
			trigger: 'mdi:lightning-bolt',
			action: 'mdi:play-circle'
		};

		return defaultIcons[type];
	}

	$: iconName = getIconForApp(appName, type);
</script>

<button
	class="btn variant-soft flex items-center justify-start p-4 h-auto text-left hover:variant-soft-primary transition-colors duration-200"
	on:click={onClick}
>
	<Icon icon={iconName} class="text-2xl md:text-3xl mr-2 md:mr-4" width="24" height="24" />
	<span class="text-sm md:text-base">{item}</span>
</button>
