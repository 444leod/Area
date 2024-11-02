import { error } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setError } from '$lib/store/errorMessage';

const API_URL = import.meta.env.VITE_API_URL as string;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		throw error(401, 'Unauthorized');
	}
	try {
		const response = await fetch(`${API_URL}/areas`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		if (!response.ok) {
			throw error(response.status, 'Failed to fetch services');
		}
		const services = await response.json();
		return {
			services,
			token
		};
	} catch (err) {
		setError(err.message);
		throw error(500, 'Internal Server Error');
	}
};

export const actions: Actions = {
	toggleArea: async ({ request, cookies }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const areaId = formData.get('areaId') as string;

		if (!token) {
			throw error(401, 'Not authenticated');
		}

		try {
			const response = await fetch(`${API_URL}/areas/${areaId}/toggle`, {
				method: 'PATCH',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			const resData = await response.json();
			if (!response.ok) {
				return {
					type: 'error',
					message: 'Failed to toggle area'
				};
			}

			return {
				type: 'success',
				data: resData
			};
		} catch (e) {
			throw error(500, 'Failed to toggle area status');
		}
	}
};