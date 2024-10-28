import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteAreaById } from "../../../lib/modules/deleteAreaById";

describe('deleteAreaById', () => {
    const mockFetch = vi.fn();

    beforeEach(() => {
        vi.stubGlobal('fetch', mockFetch);
        vi.stubEnv('VITE_API_URL', 'http://localhost:8080');
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetAllMocks();
    });

    it('should successfully delete an area', async () => {
        const mockResponse = { status: 200, ok: true };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            headers: new Headers({'content-type': 'application/json'}),
            json: () => Promise.resolve(mockResponse)
        });

        const result = await deleteAreaById('test-id', 'test-token');

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/areas/test-id',
            {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer test-token'
                }
            }
        );
        expect(result).toEqual(mockResponse);
    });

    it('should handle non-JSON responses', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 204,
            headers: new Headers({'content-type': 'text/plain'}),
        });

        const result = await deleteAreaById('test-id', 'test-token');
        expect(result).toEqual({ status: 204, ok: true });
    });

    it('should throw an error when the request fails', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        await expect(deleteAreaById('test-id', 'test-token'))
            .rejects
            .toThrow('HTTP error! status: 404');
    });
});