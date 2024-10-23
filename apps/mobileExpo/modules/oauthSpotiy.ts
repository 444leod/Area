import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

// Enregistrer votre schéma d'application pour le deep linking
WebBrowser.maybeCompleteAuthSession();

// Configuration Spotify
const spotifyConfig = {
    clientId: "c492c8e69e99485bb8b0be0f558e3648",
    scopes: [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private'
    ]
};

// Définir la configuration de l'authentification Spotify
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token'
};

const oauthSpotify = async () => {
    try {
        // Créer l'URI de redirection
        const redirectUri = makeRedirectUri({
            native: 'com.jbazan.mobileexpo://oauth/spotify', // Remplacer par votre schéma d'application
            useProxy: true // Utiliser le proxy Expo pour le développement
        });

        // Construction de l'URL d'autorisation Spotify
        const authUrl = `${discovery.authorizationEndpoint}?` +
            `client_id=${spotifyConfig.clientId}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(spotifyConfig.scopes.join(' '))}` +
            `&access_type=offline` +
            `&show_dialog=true`; // Permet à l'utilisateur de voir l'écran de connexion même s'il est déjà connecté

        const result = await WebBrowser.openAuthSessionAsync(
            authUrl,
            redirectUri,
            {
                showInRecents: true,
                preferEphemeralSession: true
            }
        );

        if (result.type === 'success') {
            const { url } = result;
            // Extraire le code d'autorisation
            const code = url.includes('?code=')
                ? url.split('?code=')[1].split('&')[0]
                : null;

            if (code) {
                // Ici, appeler votre backend avec le code
                console.log('Code d\'autorisation Spotify obtenu:', code);
                return code;
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'authentification Spotify:', error);
        throw error;
    }
};

export { oauthSpotify };