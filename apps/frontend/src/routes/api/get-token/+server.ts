export function GET({ cookies }) {
    const token = cookies.get('token');
    if (!token) {
        return new Response(JSON.stringify({ token: null }), { status: 401 });
    }
    return new Response(JSON.stringify({ token }), { status: 200 });
}