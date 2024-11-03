import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API_URL = import.meta.env.VITE_API_URL;

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		throw error(401, 'Not authenticated');
	}

	try {
		const body = await request.json();
		const type = body.type;

		const response = await fetch(`${API_URL}/auth/disconnect`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ type })
		});

		if (!response.ok) {
			throw error(response.status, 'Failed to disconnect service');
		}

		return new Response(JSON.stringify({ success: true }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error('Error disconnecting service:', e);
		throw error(500, 'Failed to disconnect service');
	}
};
