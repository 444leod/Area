import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { User } from '@shared/dtos/user';

const API_URL = import.meta.env.VITE_API_URL;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');
		const name = formData.get('name');
        console.log('formData:', formData);
		// Basic validation
		if (!email || !password || !confirmPassword || !name) {
			return fail(400, { error: 'All fields are required' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		try {
			const response = await fetch(`${API_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
					email,
					password
				})
			});
            console.log(await response.json());
			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, { error: errorData.message || 'Registration failed' });
			}
			const user: User = await response.json();
			return { success: true, user };
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}
	}
};
