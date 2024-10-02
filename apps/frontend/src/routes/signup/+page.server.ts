import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const API_URL = import.meta.env.VITE_API_URL;

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
	const first_name = formData.get('first_name');
	const last_name = formData.get('last_name');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, first_name, last_name })
      });

      if (!response.ok) {
        return fail(400, { email, incorrect: true });
      }

      const data = await response.json();
      cookies.set('token', data.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7
      });
    } catch (error) {
      console.error('Unexpected error during login:', error);
      return fail(500, { email, error: 'An unexpected error occurred' });
    }
    throw redirect(303, '/dashboard');
  }
};