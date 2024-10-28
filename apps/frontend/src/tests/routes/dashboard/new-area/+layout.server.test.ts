import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from '../../../../routes/dashboard/new-area/+layout.server';

vi.mock('@sveltejs/kit', () => ({
	redirect: (status: number, location: string) => {
		throw { status, location };
	}
}));

describe('New Area Layout Server Load', () => {
	const mockFetch = vi.fn();
	const mockCookies = {
		get: vi.fn()
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal('VITE_API_URL', 'http://localhost:8080');
	});

	it('should load data successfully', async () => {
		const mockServices = [{ name: 'Test Service' }];
		const mockAuthorizations = ['SERVICE1'];
		mockCookies.get.mockReturnValue('test-token');

		mockFetch
			.mockResolvedValueOnce({
				json: () => Promise.resolve(mockServices)
			})
			.mockResolvedValueOnce({
				json: () => Promise.resolve(mockAuthorizations)
			});

		const result = await load({
			fetch: mockFetch,
			cookies: mockCookies,
			url: new URL('http://localhost/dashboard/new-area/trigger-app')
		});

		expect(result.services).toEqual(mockServices);
		expect(result.authorizations).toEqual(mockAuthorizations);
		expect(result.currentStepIndex).toBe(0);
	});

	it('should redirect when no token', async () => {
		mockCookies.get.mockReturnValue(null);

		await expect(
			load({
				fetch: mockFetch,
				cookies: mockCookies,
				url: new URL('http://localhost/dashboard/new-area/trigger-app')
			})
		).rejects.toEqual({
			status: 302,
			location: '/login'
		});
	});

	it('should calculate correct step index', async () => {
		mockCookies.get.mockReturnValue('test-token');
		mockFetch
			.mockResolvedValueOnce({
				json: () => Promise.resolve([])
			})
			.mockResolvedValueOnce({
				json: () => Promise.resolve([])
			});

		const result = await load({
			fetch: mockFetch,
			cookies: mockCookies,
			url: new URL('http://localhost/dashboard/new-area/configure')
		});

		expect(result.currentStepIndex).toBe(4);
	});
});
