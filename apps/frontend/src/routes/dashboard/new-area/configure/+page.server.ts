import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
    const { services, authorizations } = await parent();
    return {
        services,
        authorizations
    };
};