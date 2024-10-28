// +page.server.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { error } from '@sveltejs/kit';
import { load, actions } from "../../../../routes/profile/authorization/+page.server";

vi.mock('@sveltejs/kit', () => ({
    error: (status: number, message: string) => {
        throw { status, body: { message } };
    }
}));

describe('Services Server', () => {
    const mockFetch = vi.fn();
    const mockCookies = {
        get: vi.fn()
    };
    const mockConsole = {
        error: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('console', mockConsole);
        mockCookies.get.mockReturnValue('test-token');
    });

    describe('load function', () => {
        it('should load services and authorizations successfully', async () => {
            const mockServices = [{
                name: 'Service1',
                actions: ['action1'],
                reactions: ['reaction1']
            }];
            const mockAuths = ['SERVICE1'];

            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockServices)
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockAuths)
                });

            const result = await load({
                fetch: mockFetch,
                cookies: mockCookies
            });

            expect(result.services[0].actions[0]).toEqual({ type: 'action1' });
            expect(result.authorizations).toEqual(mockAuths);
        });

        it('should throw error if not authenticated', async () => {
            mockCookies.get.mockReturnValue(null);

            await expect(async () => {
                await load({ fetch: mockFetch, cookies: mockCookies });
            }).rejects.toMatchObject({
                status: 401,
                body: { message: 'Not authenticated' }
            });
        });
    });

    describe('disconnect action', () => {
        it('should disconnect service successfully', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true
            });

            const formData = new FormData();
            formData.append('service', 'Google');

            const result = await actions.disconnect({
                request: { formData: () => Promise.resolve(formData) },
                fetch: mockFetch,
                cookies: mockCookies,
                url: new URL('http://localhost')
            });

            expect(result).toEqual({ success: true });
        });

        it('should handle unauthorized disconnect', async () => {
            mockCookies.get.mockReturnValue(null);

            const formData = new FormData();
            formData.append('service', 'Google');

            await expect(async () => {
                await actions.disconnect({
                    request: { formData: () => Promise.resolve(formData) },
                    fetch: mockFetch,
                    cookies: mockCookies,
                    url: new URL('http://localhost')
                });
            }).rejects.toMatchObject({
                status: 401,
                body: { message: 'Not authenticated' }
            });
        });
    });
});