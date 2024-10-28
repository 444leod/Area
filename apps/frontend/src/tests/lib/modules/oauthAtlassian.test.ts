// src/lib/modules/oauthAtlassian.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { oauthAtlassian } from '../../../lib/modules/oauthAtlassian';

describe('oauthAtlassian', () => {
	const originalLocation = window.location;

	beforeEach(() => {
		vi.stubEnv('VITE_ATLASSIAN_CLIENT_ID', 'test-client-id');
		delete (window as any).location;
		window.location = { ...originalLocation, origin: 'http://localhost:3000' } as any;
	});

	afterEach(() => {
		window.location = originalLocation;
	});

	it('should redirect to the correct Atlassian OAuth URL', () => {
		// Mock location.href setter
		const hrefSetter = vi.fn();
		Object.defineProperty(window.location, 'href', {
			set: hrefSetter
		});

		oauthAtlassian();

		const expectedRedirectUri = encodeURIComponent('http://localhost:3000/login/oauth/atlassian');
		const expectedScope = encodeURIComponent('read:jira-work write:jira-work offline_access');
		const expectedUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=test-client-id&scope=${expectedScope}&redirect_uri=${expectedRedirectUri}&response_type=code&prompt=consent`;

		expect(hrefSetter).toHaveBeenCalledWith(expectedUrl);
	});
});
