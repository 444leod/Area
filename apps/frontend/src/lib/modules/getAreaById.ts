const API_URL = import.meta.env.VITE_API_URL as string;

export async function getAreaById(id: string, token: string) {
	const response = await fetch(`${API_URL}/areas/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	if (!response.ok) {
		throw new Error('Failed to fetch area');
	}
	return await response.json();
}
