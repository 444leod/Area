import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API_URL = import.meta.env.VITE_API_URL;

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { code } = await request.json();

		const response = await fetch(`${API_URL}/auth/google`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code })
		});

		if (!response.ok) {
			throw error(response.status, 'Failed to authenticate with Google');
		}

		const data = await response.json();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		throw error(500, 'Failed to process Google authentication');
	}
};
