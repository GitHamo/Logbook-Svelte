import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
    // Clear any authentication cookies
    cookies.delete('auth_token', { path: '/' });
    
    // Redirect to login page
    throw redirect(302, '/login');
}; 