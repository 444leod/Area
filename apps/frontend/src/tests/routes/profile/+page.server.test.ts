// src/tests/routes/profile/+page.server.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from '../../../routes/profile/+page.server';
import { error, redirect } from '@sveltejs/kit';

describe('Profile Server Load', () => {
    const mockToken = 'mock-token';
    const mockProfile = {
        first_name: 'John',
        email: 'john@example.com',
        areas: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('VITE_API_URL', 'http://localhost:8080');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('should redirect if no token is present', async () => {
        const mockContext = {
            cookies: {
                get: vi.fn().mockReturnValue(null)
            },
            fetch: vi.fn()
        };

        await expect(async () => {
            await load(mockContext as any);
        }).rejects.toEqual(expect.objectContaining({
            status: 302,
            location: '/login'
        }));

        expect(mockContext.cookies.get).toHaveBeenCalledWith('token');
        expect(mockContext.fetch).not.toHaveBeenCalled();
    });

    it('should load profile successfully', async () => {
        const mockContext = {
            cookies: {
                get: vi.fn().mockReturnValue(mockToken)
            },
            fetch: vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockProfile)
            })
        };

        const result = await load(mockContext as any);

        expect(result).toEqual({ profile: mockProfile });
        expect(mockContext.cookies.get).toHaveBeenCalledWith('token');
        expect(mockContext.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/users/profile',
            {
                headers: {
                    Authorization: `Bearer ${mockToken}`
                }
            }
        );
    });

    it('should throw error on failed profile fetch', async () => {
        const mockContext = {
            cookies: {
                get: vi.fn().mockReturnValue(mockToken)
            },
            fetch: vi.fn().mockResolvedValue({
                ok: false,
                status: 500
            })
        };

        await expect(async () => {
            await load(mockContext as any);
        }).rejects.toEqual(expect.objectContaining({
            status: 500,
            body: { message: 'Failed to fetch user profile' }
        }));
    });
});