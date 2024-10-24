<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	export let app: { id: number; name: string };
	export let onClick: () => void;

	function getIconForApp(appName: string): string {
		const iconMap: Record<string, string> = {
			google: 'logos:google-icon',
			gmail: 'logos:google-gmail',
			'google drive': 'logos:google-drive',
			'google calendar': 'logos:google-calendar',
			'google task': 'gg:google-tasks',
			github: 'logos:github-icon',
			atlassian: 'logos:atlassian',
			trello: 'logos:trello',
			slack: 'logos:slack-icon',
			discord: 'logos:discord-icon',
			dropbox: 'logos:dropbox',
			twitter: 'logos:twitter',
			facebook: 'logos:facebook',
			instagram: 'logos:instagram-icon',
			linkedin: 'logos:linkedin-icon',
			youtube: 'logos:youtube-icon',
			spotify: 'logos:spotify-icon',
			twitch: 'logos:twitch',
			reddit: 'logos:reddit-icon',
			pinterest: 'logos:pinterest',
			asana: 'logos:asana',
			notion: 'logos:notion-icon',
			evernote: 'logos:evernote',
			'microsoft teams': 'logos:microsoft-teams',
			zoom: 'logos:zoom-icon',
			salesforce: 'logos:salesforce',
			hubspot: 'logos:hubspot',
			mailchimp: 'logos:mailchimp',
			zapier: 'logos:zapier-icon',
			ifttt: 'logos:ifttt',
			mail: 'material-symbols:mail'
		};

		const normalizedAppName = appName.toLowerCase();
		return iconMap[normalizedAppName] || 'mdi:application';
	}

	const iconName = getIconForApp(app.name);
</script>

<button
	in:fly={{ y: 50, duration: 300, delay: app.id * 50 }}
	class="card variant-soft-hover cursor-pointer transition-all duration-200 hover:scale-105"
	on:click={onClick}
>
	<header class="card-header flex justify-center items-center h-16 md:h-24">
		<Icon icon={iconName} width="48" height="48" />
	</header>
	<section class="p-2 md:p-4 text-center">
		<h3 class="text-sm md:text-base">{app.name}</h3>
	</section>
</button>
