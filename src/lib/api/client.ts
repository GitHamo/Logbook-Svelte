import { APP_CONSTANTS } from '$lib';

export class ApiClient {
    static async fetch(url: string, options: RequestInit = {}): Promise<Response> {
        // Prepare headers
        const headers = new Headers(options.headers || {});
        headers.set('X-Requested-With', 'XMLHttpRequest');  // Required for Laravel to recognize AJAX request
        headers.set('Accept', 'application/json');

        if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
            headers.set('Content-Type', 'application/json');
        }

        // Merge our headers with the provided options
        const config: RequestInit = {
            ...options,
            headers,
            credentials: 'include'  // Important for cookies
        };

        try {
            const response = await fetch(url, config);

            // 🔐 Handle 401 responses centrally
            if (response.status === 401) {
                // todo: emit an event here
                console.warn('Unauthorized - redirecting to login or refreshing token...');
            }

            return response;
        } catch (error: any) {
            // Intercept network errors (e.g., ECONNREFUSED)
            const msg = error?.message?.toLowerCase() || '';
            const isConnectionRefused =
                error instanceof Error &&
                (
                    msg.includes('failed to fetch') ||      // Chrome
                    msg.includes('networkerror') ||         // Firefox
                    msg.includes('load failed') ||          // Safari
                    msg.includes('connection refused') || // node-fetch
                    msg.includes('ecconnrefused') ||       // node-fetch
                    msg.includes('fetch failed') ||          // polyfill like
                    msg.includes('connection refused')   // node-fetch or custom environments
                );

            if (isConnectionRefused) {
                const connectionRefusedMessage = 'Connection refused. Please check your network or server status.';
                // Handle connection refused (typically this message for browser fetch)
                console.warn(connectionRefusedMessage);

                throw new Error(connectionRefusedMessage);
            }

            throw error; // Rethrow if it's not the specific error you're handling
        }
    }

    static async get(endpoint: string, options: RequestInit = {}) {
        return this.fetch(`${APP_CONSTANTS.API.BASE_URL}${endpoint}`, {
            ...options,
            method: 'GET'
        });
    }

    static async post(endpoint: string, data: any, options: RequestInit = {}) {
        return this.fetch(`${APP_CONSTANTS.API.BASE_URL}${endpoint}`, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async put(endpoint: string, data: any, options: RequestInit = {}) {
        return this.fetch(`${APP_CONSTANTS.API.BASE_URL}${endpoint}`, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async delete(endpoint: string, options: RequestInit = {}) {
        return this.fetch(`${APP_CONSTANTS.API.BASE_URL}${endpoint}`, {
            ...options,
            method: 'DELETE'
        });
    }
}
