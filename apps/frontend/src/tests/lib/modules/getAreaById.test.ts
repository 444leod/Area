import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAreaById } from "../../../lib/modules/getAreaById";

describe('getAreaById', () => {
    const mockFetch = vi.fn();

    beforeEach(() => {
        vi.stubGlobal('fetch', mockFetch);
        vi.stubEnv('VITE_API_URL', 'http://localhost:8080');
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetAllMocks();
    });

    it('should successfully fetch an area', async () => {
        const mockArea = { id: 'test-id', name: 'Test Area' };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockArea)
        });

        const result = await getAreaById('test-id', 'test-token');

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/areas/test-id', // URL corrigée
            {
                headers: {
                    Authorization: 'Bearer test-token'
                }
            }
        );
        expect(result).toEqual(mockArea);
    });

    it('should throw an error when the request fails', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        await expect(getAreaById('test-id', 'test-token'))
            .rejects
            .toThrow('Failed to fetch area');
    });
});