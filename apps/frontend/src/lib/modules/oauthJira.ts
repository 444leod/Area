export function oauthJira() {
    const clientId = import.meta.env.VITE_JIRA_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/login/oauth/jira`);
    const scope = encodeURIComponent('read:jira-work write:jira-work offline_access');
    const jiraAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=code&prompt=consent`;

    window.location.href = jiraAuthUrl;
}