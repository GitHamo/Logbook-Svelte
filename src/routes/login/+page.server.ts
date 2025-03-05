import { login } from '$lib/api/auth';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const username = data.get('username')?.toString();
        const password = data.get('password')?.toString();

        if (!username || !password) {
            return fail(400, { 
                username, 
                error: 'Username and password are required' 
            });
        }

        const user = await login(username, password);

        if (user) {
            // Set server-side cookie
            event.cookies.set('auth_token', JSON.stringify(user), {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            // Redirect to books page
            throw redirect(302, '/books');
        }

        return fail(400, { 
            username, 
            error: 'Invalid credentials' 
        });
    }
};
