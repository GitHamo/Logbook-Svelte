import { APP_CONSTANTS } from '$lib';

export class ApiClient {
    private static csrfToken: string | null = null;
    private static initPromise: Promise<void> | null = null;

    static async init() {
        // If initialization is already in progress, return the existing promise
        if (this.initPromise) {
            return this.initPromise;
        }

        // If we already have a CSRF token, no need to fetch again
        if (this.csrfToken) {
            return Promise.resolve();
        }

        // Create a new initialization promise
        this.initPromise = (async () => {
            try {
                const response = await fetch(`${APP_CONSTANTS.API.BASE_URL}/sanctum/csrf-cookie`, {
                    credentials: 'include'  // Important for cookies
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch CSRF token');
                }

                // Get the CSRF token from cookies
                this.csrfToken = this.getCsrfTokenFromCookies();
            } finally {
                // Clear the promise so we can retry on failure
                this.initPromise = null;
            }
        })();

        return this.initPromise;
    }

    static clearToken() {
        this.csrfToken = null;
        this.initPromise = null;
    }

    private static getCsrfTokenFromCookies(): string | null {
        const cookies = document.cookie.split(';');
        const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
        if (xsrfCookie) {
            return decodeURIComponent(xsrfCookie.split('=')[1]);
        }
        return null;
    }

    static async fetch(url: string, options: RequestInit = {}): Promise<Response> {
        // Ensure we have CSRF token
        if (!this.csrfToken) {
            await this.init();
        }

        // Prepare headers
        const headers = new Headers(options.headers || {});
        headers.set('X-Requested-With', 'XMLHttpRequest');  // Required for Laravel to recognize AJAX request
        headers.set('Accept', 'application/json');
        
        // Add CSRF token if we have it
        if (this.csrfToken) {
            headers.set('X-XSRF-TOKEN', this.csrfToken);
        }
        
        if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
            headers.set('Content-Type', 'application/json');
        }

        // Merge our headers with the provided options
        const config: RequestInit = {
            ...options,
            headers,
            credentials: 'include'  // Important for cookies
        };

        return fetch(url, config);
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