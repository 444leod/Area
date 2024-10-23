export function oauthDiscord() {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}/login/oauth/discord`);
    const scope = encodeURIComponent("messages.read guilds guilds.members.read");
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
    window.location.href = discordAuthUrl;
}