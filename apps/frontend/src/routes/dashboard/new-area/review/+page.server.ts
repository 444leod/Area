// /src/routes/dashboard/new-area/review/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AreaCreationDto } from '@area/shared';

const API_URL = import.meta.env.VITE_API_URL;

export const load: PageServerLoad = async ({ parent }) => {
    const { services } = await parent();
    return { services };
};

export const actions: Actions = {
    createArea: async ({ request, fetch, cookies }) => {
        const token = cookies.get('token');
        if (!token) {
            return fail(401, { message: 'Not authorized' });
        }

        try {
            const formData = await request.formData();
            const actionDetails = JSON.parse(formData.get('actionDetails') as string);
            const reactionDetails = JSON.parse(formData.get('reactionDetails') as string);
            const areaName = formData.get('areaName') as string;

            const areaData: AreaCreationDto = {
                name: areaName,
                action: {
                    type: actionDetails.type,
                    ...actionDetails.params
                },
                reaction: {
                    type: reactionDetails.type,
                    ...reactionDetails.params
                }
            };

            const response = await fetch(`${API_URL}/areas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(areaData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                return fail(response.status, {
                    message: `Failed to create area: ${errorData}`
                });
            }

            const createdArea = await response.json();
            return {
                success: true,
                area: createdArea
            };
        } catch (error) {
            console.error('Error creating area:', error);
            return fail(500, {
                message: 'An unexpected error occurred while creating the area'
            });
        }
    }
};