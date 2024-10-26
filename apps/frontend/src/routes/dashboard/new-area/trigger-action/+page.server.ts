import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, depends }) => {
    depends('app:triggerApp');

    const { services, authorizations } = await parent();
    const triggerApp = services.find(service => service.actions?.length > 0);

    if (!triggerApp) {
        throw redirect(302, '/dashboard/new-area/trigger-app');
    }

    return {
        services,
        authorizations,
        triggerApp
    };
};