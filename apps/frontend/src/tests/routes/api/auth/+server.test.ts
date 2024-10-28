import { describe, it, expect, vi } from 'vitest';
import { GET } from '../../../../routes/api/auth/+server';

describe('GET /api/auth', () => {
	const mockCookies = {
		get: vi.fn()
	};

	it('should return true when token exists', async () => {
		mockCookies.get.mockReturnValue('valid-token');

		const response = await GET({ cookies: mockCookies });
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ isAuthenticated: true });
		expect(mockCookies.get).toHaveBeenCalledWith('token');
	});

	it('should return false when token does not exist', async () => {
		mockCookies.get.mockReturnValue(null);

		const response = await GET({ cookies: mockCookies });
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ isAuthenticated: false });
		expect(mockCookies.get).toHaveBeenCalledWith('token');
	});

	it('should return JSON content type', async () => {
		mockCookies.get.mockReturnValue(null);

		const response = await GET({ cookies: mockCookies });

		expect(response.headers.get('Content-Type')).toBe('application/json');
	});
});