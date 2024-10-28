import { describe, it, expect, vi } from 'vitest';
import { POST } from '../../../../routes/api/logout/+server';

describe('POST /api/logout', () => {
	const mockCookies = {
		delete: vi.fn()
	};

	it('should delete token cookie', async () => {
		const response = await POST({ cookies: mockCookies });
		const data = await response.json();

		expect(mockCookies.delete).toHaveBeenCalledWith('token', { path: '/' });
		expect(data).toEqual({ success: true });
	});

	it('should return success response', async () => {
		const response = await POST({ cookies: mockCookies });
		const data = await response.json();

		expect(data.success).toBe(true);
	});

	it('should use json helper from SvelteKit', async () => {
		const response = await POST({ cookies: mockCookies });

		expect(response.headers.get('Content-Type')).toBe('application/json');
	});

	it('should handle cookie deletion error', async () => {
		mockCookies.delete.mockImplementation(() => {
			throw new Error('Cookie deletion failed');
		});

		try {
			await POST({ cookies: mockCookies });
		} catch (error) {
			expect(error.message).toBe('Cookie deletion failed');
		}
	});
});
