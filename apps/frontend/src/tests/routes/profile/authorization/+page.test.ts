import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Page from '../../../../routes/profile/authorization/+page.svelte';
import { tick } from 'svelte';

vi.mock('$lib/modules/oauthGoogle', () => ({
	oauthGoogle: vi.fn()
}));

vi.mock('$lib/modules/oauthAtlassian', () => ({
	oauthAtlassian: vi.fn()
}));

vi.mock('$lib/modules/oauthGithub', () => ({
	oauthGithub: vi.fn()
}));

vi.mock('$lib/modules/oauthSpotify', () => ({
	oauthSpotify: vi.fn()
}));

describe('Services Page', () => {
	const mockData = {
		services: [
			{
				name: 'Google',
				actions: [{ type: 'gmail_watch' }],
				reactions: [{ type: 'gmail_send' }]
			},
			{
				name: 'Github',
				actions: [{ type: 'github_issue' }],
				reactions: [{ type: 'github_comment' }]
			}
		],
		authorizations: ['GOOGLE']
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal('fetch', vi.fn());
		// Mock window.location avec Object.defineProperty
		const mockLocation = { reload: vi.fn() };
		vi.stubGlobal('location', mockLocation);
	});

	it('should filter by connection status', async () => {
		const { container, getByLabelText } = render(Page, {
			data: mockData
		});

		await tick();

		const connectedCheckbox = getByLabelText('Connected');
		const disconnectedCheckbox = getByLabelText('Disconnected');

		await fireEvent.click(disconnectedCheckbox);
		await tick();

		const visibleCards = container.querySelectorAll('.card');
		expect(visibleCards.length).toBeGreaterThan(0);
	});
});
