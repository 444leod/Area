import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/dashboard')) {
		const tokenFromUrl = event.url.searchParams.get('token');
		const tokenFromCookies = event.cookies.get('token');
		if (!tokenFromUrl && !tokenFromCookies) {
			throw redirect(303, '/login');
		}
	}
	const response = await resolve(event);
	return response;
};