import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { setError } from '../../lib/store/errorMessage';

const API_URL = import.meta.env.VITE_API_URL as string;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		throw error(401, 'Unauthorized');
	}
	try {
		const response = await fetch(`${API_URL}/admin`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		if (!response.ok) {
			throw error(response.status, 'Failed to fetch admin page');
		}
		return {
			token,
			adminData: await response.json()
		};
	} catch (err) {
		setError(err.message);
		throw error(500, 'Interna/l Server Error');
	}
};
