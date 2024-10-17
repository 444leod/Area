import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const tokenFromCookies = event.cookies.get('token');
	if (tokenFromCookies) {
		event.locals.user = { isAuthenticated: true };
	} else {
		event.locals.user = { isAuthenticated: false };
	}

	if (event.url.pathname.startsWith('/dashboard')) {
		const tokenFromUrl = event.url.searchParams.get('token');
		if (!tokenFromUrl && !tokenFromCookies) {
			throw redirect(303, '/login');
		}
	}

	return resolve(event);
};