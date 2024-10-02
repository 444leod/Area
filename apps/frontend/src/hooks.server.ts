import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/dashboard')) {
		const token = event.cookies.get('token');
		if (!token) {
			throw redirect(303, '/login');
		}
	}
	const response = await resolve(event);
	return response;
};
