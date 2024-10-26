import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { services, authorizations } = await parent();
	const groupedServices = services.reduce(
		(acc, service) => {
			if (service.reactions && service.reactions.length > 0) {
				const category = service.category || 'Other';
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(service);
			}
			return acc;
		},
		{} as Record<string, typeof services>
	);

	return {
		groupedServices,
		authorizations
	};
};
