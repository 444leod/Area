export function oauthSpotify() {
	const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
	const redirectUri = encodeURIComponent(`${window.location.origin}/login/oauth/spotify`);
	const scope = encodeURIComponent(
		'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played'
	);

	const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline`;
	window.location.href = spotifyAuthUrl;
}
