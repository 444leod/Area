import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

const API_URL = import.meta.env.VITE_API_URL;

export const load: LayoutServerLoad = async ({ fetch, cookies, url }) => {
	const token = cookies.get('token');
	if (!token) {
		throw redirect(302, '/login');
	}

	const [servicesRes, authorizationsRes] = await Promise.all([
		fetch(`${API_URL}/services`),
		fetch(`${API_URL}/users/authorizations`, {
			headers: { Authorization: `Bearer ${token}` }
		})
	]);

	const [services, authorizations] = await Promise.all([
		servicesRes.json(),
		authorizationsRes.json()
	]);

	const steps = [
		{ path: '/dashboard/new-area/trigger-app', label: 'Choose Trigger App' },
		{ path: '/dashboard/new-area/trigger-action', label: 'Select Trigger' },
		{ path: '/dashboard/new-area/action-app', label: 'Choose Action App' },
		{ path: '/dashboard/new-area/action-selection', label: 'Select Action' },
		{ path: '/dashboard/new-area/configure', label: 'Set up Details' },
		{ path: '/dashboard/new-area/review', label: 'Review & Activate' }
	];

	const currentStepIndex = steps.findIndex((step) => step.path === url.pathname);

	return {
		services,
		authorizations,
		steps,
		currentStepIndex: currentStepIndex === -1 ? 0 : currentStepIndex
	};
};
