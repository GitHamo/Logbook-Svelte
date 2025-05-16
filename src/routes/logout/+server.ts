import { APP_CONSTANTS } from '$lib';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
    // Clear any authentication cookies
    cookies.delete(APP_CONSTANTS.COOKIES.AUTH.COOKIE_NAME, { path: '/' });

    throw redirect(302, APP_CONSTANTS.ROUTES.AFTER_LOGOUT);
};
