export function oauthGithub() {
	const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
	const redirectUri = encodeURIComponent(`${window.location.origin}/login/oauth/github`);
	const scope = encodeURIComponent('repo notifications user project workflow admin:org');
	const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&allow_signup=true`;
	window.location.href = githubAuthUrl;
}
