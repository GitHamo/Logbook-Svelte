import { login } from '$lib/api/auth';
import { fail } from '@sveltejs/kit';

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

        const token = await login(username, password);

        if (token) {
            // Set server-side cookie
            event.cookies.set('auth_token', JSON.stringify(token), {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            return {
                token,
            };

        }

        return fail(400, { 
            username, 
            error: 'Invalid credentials' 
        });
    }
};
