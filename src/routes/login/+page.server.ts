import { APP_CONSTANTS } from '$lib';
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
            event.cookies.set(APP_CONSTANTS.COOKIES.AUTH.COOKIE_NAME, JSON.stringify(token), {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: APP_CONSTANTS.COOKIES.AUTH.COOKIE_EXPIRY
            });

            return {
                token,
            };

        }

        return fail(401, { 
            username, 
            error: 'Invalid credentials' 
        });
    }
};
