import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('token');
	return new Response(JSON.stringify({ isAuthenticated: !!token }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
