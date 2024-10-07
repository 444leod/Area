const API_URL = import.meta.env.VITE_API_URL as string;

export async function deleteAreaById(id: string, token: string) {
    const response = await fetch(`${API_URL}/areas/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    } else {
        return { status: response.status, ok: response.ok };
    }
}