import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from "../../../routes/signup/+page.server";
import { fail, redirect } from '@sveltejs/kit';

describe('Signup Page Server Actions', () => {
    let mockFetch: ReturnType<typeof vi.fn>;
    let mockCookies: { set: ReturnType<typeof vi.fn> };
    let mockRequest: Request;
    let mockFormData: FormData;

    beforeEach(() => {
        vi.clearAllMocks();
        mockFetch = vi.fn();
        mockCookies = { set: vi.fn() };
        mockFormData = new FormData();
        mockRequest = new Request('http://localhost', {
            method: 'POST',
            body: mockFormData
        });
    });

    it('should handle registration failure with API error', async () => {
        // Arrange
        const errorMessage = 'Email already exists';
        mockFormData.append('email', 'test@example.com');
        mockFormData.append('password', 'password123');
        mockFormData.append('confirmPassword', 'password123');
        mockFormData.append('first_name', 'John');
        mockFormData.append('last_name', 'Doe');

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: () => Promise.resolve({ message: errorMessage })
        });

        // Act
        const result = await actions.default({
            request: mockRequest,
            fetch: mockFetch,
            cookies: mockCookies
        } as any);

        // Assert
        expect(result).toEqual(fail(400, { error: errorMessage }));
        expect(mockCookies.set).not.toHaveBeenCalled();
    });

    it('should handle unexpected errors', async () => {
        // Arrange
        mockFormData.append('email', 'test@example.com');
        mockFormData.append('password', 'password123');
        mockFormData.append('confirmPassword', 'password123');
        mockFormData.append('first_name', 'John');
        mockFormData.append('last_name', 'Doe');

        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        // Act
        const result = await actions.default({
            request: mockRequest,
            fetch: mockFetch,
            cookies: mockCookies
        } as any);

        // Assert
        expect(result).toEqual(fail(500, { error: 'An unexpected error occurredError: Network error' }));
        expect(mockCookies.set).not.toHaveBeenCalled();
    });

    it('should handle registration failure without error message', async () => {
        // Arrange
        mockFormData.append('email', 'test@example.com');
        mockFormData.append('password', 'password123');
        mockFormData.append('confirmPassword', 'password123');
        mockFormData.append('first_name', 'John');
        mockFormData.append('last_name', 'Doe');

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: () => Promise.resolve({})
        });

        // Act
        const result = await actions.default({
            request: mockRequest,
            fetch: mockFetch,
            cookies: mockCookies
        } as any);

        // Assert
        expect(result).toEqual(fail(400, { error: 'Registration failed' }));
        expect(mockCookies.set).not.toHaveBeenCalled();
    });
});