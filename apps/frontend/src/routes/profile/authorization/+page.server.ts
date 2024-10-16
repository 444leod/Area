import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const API_URL = import.meta.env.VITE_API_URL;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const token = cookies.get('token');

    if (!token) {
        throw error(401, 'Not authenticated');
    }

    try {
        const response = await fetch(`${API_URL}/users/authorization`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 404) {
            throw error(404, 'User not found');
        }
        if (!response.ok) {
            throw error(response.status, 'Failed to fetch authorizations');
        }
        const authorizations: string[] = await response.json();
        return {
            authorizations
        };
    } catch (err) {
        console.error('Error fetching authorizations:', err);
        throw error(500, 'Internal server error');
    }
};