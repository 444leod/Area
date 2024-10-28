import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toggleAreaStatus } from '../../../lib/modules/toggleAreaStatus';

describe('toggleAreaStatus', () => {
    const mockFetch = vi.fn();

    beforeEach(() => {
        vi.stubGlobal('fetch', mockFetch);
        vi.stubEnv('VITE_API_URL', 'http://localhost:8080');
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetAllMocks();
    });

    it('should successfully toggle area status', async () => {
        const mockResponse = { status: 'toggled', enabled: true };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const result = await toggleAreaStatus('test-id', 'test-token');

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/areas/test-id/toggle',
            {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer test-token'
                }
            }
        );
        expect(result).toEqual(mockResponse);
    });

    it('should throw an error when the request fails', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        await expect(toggleAreaStatus('test-id', 'test-token'))
            .rejects
            .toThrow('HTTP error! status: 404');
    });
});