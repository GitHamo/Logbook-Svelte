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