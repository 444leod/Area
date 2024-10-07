import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const API_URL = import.meta.env.VITE_API_URL;

export const actions: Actions = {
	createArea: async ({ request, fetch, cookies }) => {
		const token = cookies.get('token');
		if (!token) {
			return fail(401, { message: 'Not authorized' });
		}

		const formData = await request.formData();
		const actionDetails = JSON.parse(formData.get('actionDetails') as string);
		const reactionDetails = JSON.parse(formData.get('reactionDetails') as string);

		const newArea = {
			action: actionDetails,
			reaction: reactionDetails
		};
		try {
			const response = await fetch(`${API_URL}/areas`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(newArea)
			});

			if (!response.ok) {
				const errorData = await response.text();
				console.error('Error response:', errorData);
				return fail(response.status, { message: `Failed to create new area: ${errorData}` });
			}

			const createdArea = await response.json();
			return { success: true, area: createdArea };
		} catch (err) {
			console.error('Error creating new area:', err);
			return fail(500, { message: 'Failed to create automation' });
		}
	}
};
