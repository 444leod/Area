import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

const github_clientId = process.env.EXPO_GITHUB_CLIENT_ID;

// Assurez-vous d'avoir ces variables dans app.config.js ou app.json
const githubConfig = {
    clientId: "825177499555-l1gkngu2n3okinepggamb40marvkr39p.apps.googleusercontent.com",
    // Les scopes doivent être séparés par des espaces dans l'URL finale
    scopes: [
        'repo',
        'notifications',
        'user',
        'project',
        'workflow',
        'admin:org'
    ]
};

const oauthGithub = async () => {
    // Créer l'URI de redirection pour Expo
    const redirectUri = makeRedirectUri({
        scheme: 'com.jbazan.mobileexpo', // Remplacer par votre scheme d'application
        path: 'com.jbazan.mobileexpo/login/oauth/github'
    });

    console.log(githubConfig.clientId);
    // Construction de l'URL d'autorisation GitHub
    const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${githubConfig.clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(githubConfig.scopes.join(' '))}` +
        `&allow_signup=true`;

    try {
        const result = await WebBrowser.openAuthSessionAsync(
            githubAuthUrl,
            redirectUri
        );

        if (result.type === 'success') {
            // Extraire le code d'autorisation de l'URL de redirection
            const code = result.url.split('code=')[1];

            console.log(code);
            // Ici, vous pouvez appeler votre backend avec le code
            // pour obtenir le token d'accès
            return code;
        }
    } catch (error) {
        console.error('Erreur lors de l\'authentification GitHub:', error);
        throw error;
    }
};

export { oauthGithub };