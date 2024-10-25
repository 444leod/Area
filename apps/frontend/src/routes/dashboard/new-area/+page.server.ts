import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setError } from '$lib/store/errorMessage';

const API_URL = import.meta.env.VITE_API_URL;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		return { services: [], authorizations: [] };
	}

	try {
		const [servicesResponse, authorizationsResponse] = await Promise.all([
			fetch(`${API_URL}/services`),
			fetch(`${API_URL}/users/authorizations`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
		]);

		if (!servicesResponse.ok || !authorizationsResponse.ok) {
			throw new Error('Failed to fetch data');
		}

		const [services, authorizations] = await Promise.all([
			servicesResponse.json(),
			authorizationsResponse.json()
		]);

		return { services, authorizations };
	} catch (err) {
		setError(err);
		return { services: [], authorizations: [] };
	}
};

export const actions: Actions = {
	createArea: async ({ request, fetch, cookies }) => {
		const token = cookies.get('token');
		if (!token) {
			return fail(401, { message: 'Not authorized' });
		}

		const formData = await request.formData();
		const actionDetails = JSON.parse(formData.get('actionDetails') as string);
		const reactionDetails = JSON.parse(formData.get('reactionDetails') as string);
		const areaName = formData.get('areaName') as string;

		const newAction = {
			type: actionDetails.type,
			...actionDetails.params
		};
		const newReaction = {
			type: reactionDetails.type,
			...reactionDetails.params
		};

		const newArea = {
			name: areaName,
			action: newAction,
			reaction: newReaction
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
				setError('Error response:' + errorData);
				return fail(response.status, { message: `Failed to create new area: ${errorData}` });
			}

			const createdArea = await response.json();
			return { success: true, area: createdArea };
		} catch (err) {
			setError('Error creating new area:' + err);
			return fail(500, { message: 'Failed to create automation' });
		}
	}
};
