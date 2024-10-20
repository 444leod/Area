import axios, { AxiosResponse } from 'axios';

interface ReducedRepository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: {
        id: number;
        login: string;
        avatar_url: string;
        html_url: string;
    };
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    language: string | null;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    created_at: string;
    updated_at: string;
}

export async function getUserRepositories(token: string): Promise<ReducedRepository[] | null> {
    try {
        const response: AxiosResponse<ReducedRepository[]> = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data as ReducedRepository[];
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getSortedUserRepositoriesSince(
    token: string,
    since: Date,
    sortKey: string = 'created_at',
    order: string = 'asc'
): Promise<ReducedRepository[] | null> {
    try {
        const response: AxiosResponse<ReducedRepository[]> = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                since: since.toISOString(),
                sort: sortKey,
                direction: order,
            },
        });

        return response.data as ReducedRepository[];
    } catch (error) {
        console.error(error);
        return null;
    }
}
