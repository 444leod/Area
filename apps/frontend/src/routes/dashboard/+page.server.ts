import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	if (url.searchParams.get('token')) {
		cookies.set('token', url.searchParams.get('token'), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 1 semaine
		});
	}
 
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
		return { services };
	} catch (err) {
		console.error('Error fetching services:', err);
		throw error(500, 'Internal Server Error');
	}
};
