import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const API_URL = import.meta.env.VITE_API_URL;

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');
		const first_name = formData.get('first_name');
		const last_name = formData.get('last_name');

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		try {
			const response = await fetch(`${API_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password, first_name, last_name })
			});

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, { error: errorData.message || 'Registration failed' });
			}

			const data = await response.json();
			cookies.set('token', data.token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});

			return { success: true };
		} catch (error) {
			return fail(500, { error: 'An unexpected error occurred' + error });
		}
	}
};
