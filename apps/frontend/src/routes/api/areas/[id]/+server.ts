import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API_URL = import.meta.env.VITE_API_URL;

export const GET: RequestHandler = async ({ params, cookies }) => {
    const token = cookies.get('token');
    if (!token) {
        throw error(401, 'Not authenticated');
    }

    try {
        const response = await fetch(`${API_URL}/areas/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw error(response.status, 'Failed to fetch area');
        }

        const area = await response.json();
        return new Response(JSON.stringify(area), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        throw error(500, 'Failed to fetch area details');
    }
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
    const token = cookies.get('token');
    if (!token) {
        throw error(401, 'Not authenticated');
    }

    try {
        const response = await fetch(`${API_URL}/areas/${params.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw error(response.status, 'Failed to delete area');
        }

        return new Response(null, { status: 204 });
    } catch (e) {
        throw error(500, 'Failed to delete area');
    }
};

export const PATCH: RequestHandler = async ({ params, cookies }) => {
    const token = cookies.get('token');
    if (!token) {
        throw error(401, 'Not authenticated');
    }

    try {
        const response = await fetch(`${API_URL}/areas/${params.id}/toggle`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw error(response.status, 'Failed to toggle area');
        }

        const result = await response.json();
        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        throw error(500, 'Failed to toggle area status');
    }
};