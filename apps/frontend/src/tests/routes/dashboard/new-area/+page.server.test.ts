import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../../routes/dashboard/new-area/+page.server';

describe('New Area Page Server Load', () => {
	const mockCookies = {
		get: vi.fn()
	};

	it('should redirect when no token', async () => {
		mockCookies.get.mockReturnValue(null);

		await expect(
			load({
				cookies: mockCookies
			})
		).rejects.toEqual({
			status: 302,
			location: '/login'
		});
	});

	it('should return empty object when authenticated', async () => {
		mockCookies.get.mockReturnValue('test-token');

		const result = await load({
			cookies: mockCookies
		});

		expect(result).toEqual({});
	});
});
