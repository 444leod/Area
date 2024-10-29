import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setError } from '$lib/store/errorMessage';

const API_URL = import.meta.env.VITE_API_URL;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');

	if (!token) {
		throw error(401, 'Not authenticated');
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
		if (!servicesResponse.ok) {
			throw error(servicesResponse.status, 'Failed to fetch services');
		}
		if (authorizationsResponse.status === 404) {
			throw error(404, 'User not found');
		}
		if (!authorizationsResponse.ok) {
			throw error(authorizationsResponse.status, 'Failed to fetch authorizations');
		}
		const [services, authorizations] = await Promise.all([
			servicesResponse.json(),
			authorizationsResponse.json()
		]);
		const transformedServices = services.map((service) => ({
			...service,
			actions: service.actions.map((action) =>
				typeof action === 'object' ? action : { type: action }
			),
			reactions: service.reactions.map((reaction) =>
				typeof reaction === 'object' ? reaction : { type: reaction }
			)
		}));
		return {
			services: transformedServices,
			authorizations
		};
	} catch (err) {
		console.error('Error loading data:', err);
		setError(err instanceof Error ? err.message : 'Failed to load data');
		throw error(500, 'Internal server error');
	}
};

export const actions = {
	disconnect: async ({ request, fetch, cookies }) => {
		const token = cookies.get('token');
		if (!token) {
			throw error(401, 'Not authenticated');
		}

		try {
			const formData = await request.formData();
			const serviceName = formData.get('service');

			const response = await fetch(`${API_URL}/users/authorizations/${serviceName}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				throw error(response.status, 'Failed to disconnect service');
			}

			return { success: true };
		} catch (err) {
			console.error('Error disconnecting service:', err);
			setError(err instanceof Error ? err.message : 'Failed to disconnect service');
			throw error(500, 'Internal server error');
		}
	}
};
