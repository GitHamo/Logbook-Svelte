import { APP_CONSTANTS } from '$lib';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// Create a hook to handle authentication
const authHook: Handle = async ({ event, resolve }) => {
    // Get the auth token from cookies
    const authToken = event.cookies.get(APP_CONSTANTS.COOKIES.AUTH.COOKIE_NAME);

    if(event.url.pathname !== '/login' && !authToken) {
        throw redirect(303, '/login');
    }

    event.locals.authToken = authToken ? JSON.parse(authToken) : null;

    return resolve(event);
};

// Create a hook to handle current book
const currentBookHook: Handle = async ({ event, resolve }) => {
    // Get the current book from cookies
    const currentBook = event.cookies.get(APP_CONSTANTS.COOKIES.CURRENT_BOOK.COOKIE_NAME);
    event.locals.currentBook = currentBook ? JSON.parse(currentBook) : null;

    return resolve(event);
};

// Export the hooks in sequence
export const handle: Handle = sequence(authHook, currentBookHook);
