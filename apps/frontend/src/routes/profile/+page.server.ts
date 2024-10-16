import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const token = cookies.get('token');

    if (!token) {
        throw redirect(302, '/login');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw error(response.status, 'Failed to fetch user profile');
    }
    const profile = await response.json();
    return { profile };
};