import type { Handle } from '@sveltejs/kit';

// Define the Locals interface to include authToken
declare global {
    namespace App {
        interface Locals {
            authToken: string | null;
        }
    }
}

// Create a hook to handle authentication
const authHook: Handle = async ({ event, resolve }) => {
    // Get the auth token from cookies
    const authToken = event.cookies.get('auth_token') ?? null;

    event.locals.authToken = authToken;

    // Continue with the request
    return resolve(event);
};

// Export the hook
export const handle = authHook; 