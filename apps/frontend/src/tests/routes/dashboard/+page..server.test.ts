import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from '../../../routes/dashboard/+page.server';
import { setError } from '../../../lib/store/errorMessage';

// Mock @sveltejs/kit error
vi.mock('@sveltejs/kit', () => ({
	error: (status: number, message: string) => ({ status, message })
}));

// Mock errorMessage store
vi.mock('$lib/store/errorMessage', () => ({
	setError: vi.fn()
}));

describe('Dashboard Server Load', () => {
	const mockFetch = vi.fn();
	const mockCookies = {
		get: vi.fn()
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock de l'URL de l'API locale
		vi.stubGlobal('VITE_API_URL', 'http://localhost:8080');
	});

	it('should handle unauthorized access', async () => {
		mockCookies.get.mockReturnValue(null);

		await expect(
			load({
				fetch: mockFetch,
				cookies: mockCookies
			})
		).rejects.toEqual({
			status: 401,
			message: 'Unauthorized'
		});
	});

	it('should handle network errors', async () => {
		mockCookies.get.mockReturnValue('test-token');
		mockFetch.mockRejectedValue(new Error('Network error'));

		await expect(
			load({
				fetch: mockFetch,
				cookies: mockCookies
			})
		).rejects.toEqual({
			status: 500,
			message: 'Internal Server Error'
		});

		expect(setError).toHaveBeenCalledWith('Network error');
	});

	it('should make API request with correct headers', async () => {
		mockCookies.get.mockReturnValue('test-token');
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve([])
		});

		await load({
			fetch: mockFetch,
			cookies: mockCookies
		});

		expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/areas', {
			headers: {
				Authorization: 'Bearer test-token'
			}
		});
	});
});
