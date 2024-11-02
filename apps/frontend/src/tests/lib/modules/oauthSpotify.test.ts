import { describe, it, expect, vi, beforeEach } from 'vitest';
import { oauthSpotify } from '../../../lib/modules/oauthSpotify';

describe('oauthSpotify', () => {
	const originalWindow = global.window;

	beforeEach(() => {
		// Mock complet de window
		const mockWindow = {
			location: {
				origin: 'http://localhost:8080',
				href: ''
			}
		};
		global.window = mockWindow as any;
		vi.stubEnv('VITE_SPOTIFY_CLIENT_ID', 'test-client-id');
	});

	afterEach(() => {
		global.window = originalWindow;
		vi.clearAllMocks();
	});

	it('should redirect to the correct Spotify OAuth URL', () => {
		oauthSpotify();

		const expectedRedirectUri = encodeURIComponent('http://localhost:8080/login/oauth/spotify');
		const expectedScope = encodeURIComponent(
			'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private'
		);
		const expectedUrl = `https://accounts.spotify.com/authorize?client_id=test-client-id&response_type=code&redirect_uri=${expectedRedirectUri}&scope=${expectedScope}&access_type=offline`;

		expect(window.location.href).toBe(expectedUrl);
	});
});
