import { oauthGoogle } from '$lib/modules/oauthGoogle';
import { oauthAtlassian } from '$lib/modules/oauthAtlassian';
import { oauthGithub } from '$lib/modules/oauthGithub';

export const allServices = [
	{
		name: 'Google',
		description: 'Connect to use Google services in your automations',
		icon: 'devicon:google',
		oauthFunction: oauthGoogle
	},
	{
		name: 'Atlassian',
		description: 'Connect to use Atlassian in your automations',
		icon: 'logos:atlassian',
		oauthFunction: oauthAtlassian
	},
	{
		name: 'Github',
		description: 'Connect to use Github in your automations',
		icon: 'logos:github-icon',
		oauthFunction: oauthGithub
	}
];
