import { describe, it, expect, vi } from 'vitest';
import { GET } from '../../../../routes/api/get-token/+server';

describe('GET /api/token', () => {
	const mockCookies = {
		get: vi.fn()
	};

	it('should return token when it exists', async () => {
		const testToken = 'test-token';
		mockCookies.get.mockReturnValue(testToken);

		const response = await GET({ cookies: mockCookies });
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ token: testToken });
		expect(mockCookies.get).toHaveBeenCalledWith('token');
	});

	it('should return 401 when token does not exist', async () => {
		mockCookies.get.mockReturnValue(null);

		const response = await GET({ cookies: mockCookies });
		const data = await response.json();

		expect(response.status).toBe(401);
		expect(data).toEqual({ token: null });
		expect(mockCookies.get).toHaveBeenCalledWith('token');
	});

	it('should return JSON response', async () => {
		mockCookies.get.mockReturnValue('test-token');

		const response = await GET({ cookies: mockCookies });

		expect(response.headers.get('Content-Type')).toBe('text/plain;charset=UTF-8');
	});
});