import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from '../../../routes/login/+page.server';
import { fail } from '@sveltejs/kit';

describe('Login Server Actions', () => {
    let mockFetch: any;
    let mockRequest: any;
    let mockCookies: any;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.resetAllMocks();

        // Mock fetch
        mockFetch = vi.fn();

        // Mock FormData
        mockRequest = {
            formData: vi.fn().mockResolvedValue(new Map([
                ['email', 'test@example.com'],
                ['password', 'password123']
            ]))
        };

        // Mock cookies
        mockCookies = {
            set: vi.fn()
        };

        // Mock environment variables
        vi.stubEnv('NODE_ENV', 'development');
    });

    it('should successfully log in user with valid credentials', async () => {
        const mockToken = 'mock-jwt-token';
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: mockToken })
        });

        const result = await actions.default({
            request: mockRequest,
            fetch: mockFetch,
            cookies: mockCookies
        } as any);

        // Vérifier que fetch a été appelé avec les bons paramètres
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });

        // Vérifier que le cookie a été défini correctement
        expect(mockCookies.set).toHaveBeenCalledWith(
            'token',
            mockToken,
            {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 60 * 60 * 24 * 7
            }
        );

        // Vérifier la valeur de retour
        expect(result).toEqual({ success: true });
    });

    it('should return fail with incorrect credentials', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false
        });

        const result = await actions.default({
            request: mockRequest,
            fetch: mockFetch,
            cookies: mockCookies
        } as any);

        expect(result).toEqual(
            fail(400, {
                email: 'test@example.com',
                incorrect: true
            })
        );
        expect(mockCookies.set).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await actions.default({
            request: mockRequest,
            fetch: mockFetch,
            cookies: mockCookies
        } as any);

        expect(result).toEqual(
            fail(500, {
                email: 'test@example.com',
                error: 'An unexpected error occurredError: Network error'
            })
        );
        expect(mockCookies.set).not.toHaveBeenCalled();
    });

    it('should handle malformed FormData', async () => {
        mockRequest.formData.mockResolvedValueOnce(new Map([]));

        const result = await actions.default({
            request: mockRequest,
            fetch: mockFetch,
            cookies: mockCookies
        } as any);
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
    });

    it('should handle production environment', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        const mockToken = 'mock-jwt-token';
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: mockToken })
        });

        await actions.default({
            request: mockRequest,
            fetch: mockFetch,
            cookies: mockCookies
        } as any);

        // Vérifier que le cookie a été défini avec le flag secure en production
        expect(mockCookies.set).toHaveBeenCalledWith(
            'token',
            mockToken,
            expect.objectContaining({
                secure: true
            })
        );
    });
});