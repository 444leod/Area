import { describe, it, expect, vi } from 'vitest';
import { load } from '../../../../../routes/dashboard/new-area/action-app/+page.server';

describe('Action App Selection Page Server Load', () => {
    it('should group services by category', async () => {
        const mockParent = vi.fn().mockResolvedValue({
            services: [
                {
                    _id: '1',
                    name: 'Service1',
                    category: 'Communication',
                    reactions: ['reaction1']
                },
                {
                    _id: '2',
                    name: 'Service2',
                    category: 'Communication',
                    reactions: ['reaction2']
                },
                {
                    _id: '3',
                    name: 'Service3',
                    category: 'Productivity',
                    reactions: ['reaction3']
                }
            ],
            authorizations: ['auth1', 'auth2']
        });

        const result = await load({ parent: mockParent } as any);

        expect(result.groupedServices).toEqual({
            Communication: [
                {
                    _id: '1',
                    name: 'Service1',
                    category: 'Communication',
                    reactions: ['reaction1']
                },
                {
                    _id: '2',
                    name: 'Service2',
                    category: 'Communication',
                    reactions: ['reaction2']
                }
            ],
            Productivity: [
                {
                    _id: '3',
                    name: 'Service3',
                    category: 'Productivity',
                    reactions: ['reaction3']
                }
            ]
        });
    });

    it('should handle services without category', async () => {
        const mockParent = vi.fn().mockResolvedValue({
            services: [
                {
                    _id: '1',
                    name: 'Service1',
                    reactions: ['reaction1']
                }
            ],
            authorizations: ['auth1']
        });

        const result = await load({ parent: mockParent } as any);

        expect(result.groupedServices).toEqual({
            Other: [
                {
                    _id: '1',
                    name: 'Service1',
                    reactions: ['reaction1']
                }
            ]
        });
    });

    it('should only include services with reactions', async () => {
        const mockParent = vi.fn().mockResolvedValue({
            services: [
                {
                    _id: '1',
                    name: 'Service1',
                    category: 'Communication',
                    reactions: ['reaction1']
                },
                {
                    _id: '2',
                    name: 'Service2',
                    category: 'Communication',
                    reactions: []
                }
            ],
            authorizations: ['auth1']
        });

        const result = await load({ parent: mockParent } as any);

        expect(result.groupedServices).toEqual({
            Communication: [
                {
                    _id: '1',
                    name: 'Service1',
                    category: 'Communication',
                    reactions: ['reaction1']
                }
            ]
        });
    });
});