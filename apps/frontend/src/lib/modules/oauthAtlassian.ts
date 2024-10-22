export function oauthAtlassian() {
    const clientId = import.meta.env.VITE_ATLASSIAN_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/login/oauth/atlassian`);
    const scope = encodeURIComponent('read:jira-work write:jira-work offline_access');
    const atlassianAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=code&prompt=consent`;

    window.location.href = atlassianAuthUrl;
}