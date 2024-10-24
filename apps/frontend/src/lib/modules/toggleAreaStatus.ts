const API_URL = import.meta.env.VITE_API_URL as string;

export async function toggleAreaStatus(id: string, token: string) {
	const response = await fetch(`${API_URL}/areas/${id}/toggle`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return await response.json();
}
