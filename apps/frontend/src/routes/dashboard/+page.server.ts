import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {setError} from "../../lib/store/errorMessage";

const API_URL = import.meta.env.VITE_API_URL as string;

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
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
