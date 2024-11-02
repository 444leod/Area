import { oauthGithub } from '../../../lib/modules/oauthGithub';

describe('oauthGithub', () => {
	const originalLocation = window.location;

	beforeEach(() => {
		vi.stubEnv('VITE_GITHUB_CLIENT_ID', 'test-client-id');
		delete (window as any).location;
		window.location = { ...originalLocation, origin: 'http://localhost:3000' } as any;
	});

	afterEach(() => {
		window.location = originalLocation;
	});

	it('should redirect to the correct GitHub OAuth URL', () => {
		// Mock location.href setter
		const hrefSetter = vi.fn();
		Object.defineProperty(window.location, 'href', {
			set: hrefSetter
		});

		oauthGithub();

		const expectedRedirectUri = encodeURIComponent('http://localhost:3000/login/oauth/github');
		const expectedScope = encodeURIComponent('repo notifications user project workflow admin:org');
		const expectedUrl = `https://github.com/login/oauth/authorize?client_id=test-client-id&redirect_uri=${expectedRedirectUri}&scope=${expectedScope}&allow_signup=true`;

		expect(hrefSetter).toHaveBeenCalledWith(expectedUrl);
	});
});
