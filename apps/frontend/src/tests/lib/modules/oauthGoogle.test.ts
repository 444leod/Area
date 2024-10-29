import { describe, it, expect, vi, beforeEach } from 'vitest';
import { oauthGoogle } from '../../../lib/modules/oauthGoogle';

describe('oauthGoogle', () => {
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
		vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'test-client-id');
	});

	afterEach(() => {
		global.window = originalWindow;
		vi.clearAllMocks();
	});

	it('should redirect to the correct Google OAuth URL', () => {
		oauthGoogle();

		const expectedRedirectUri = encodeURIComponent('http://localhost:8080/login/oauth');
		const expectedScope = encodeURIComponent(
			'email profile https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/tasks'
		);
		const expectedUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=test-client-id&redirect_uri=${expectedRedirectUri}&response_type=code&scope=${expectedScope}&access_type=offline`;

		expect(window.location.href).toBe(expectedUrl);
	});
});
