import { ApiClient } from './client';

export async function login(username: string, password: string): Promise<string> {
    try {
        // Initialize CSRF protection if not already initialized
        await ApiClient.init();
        
        const response = await ApiClient.post('/login', { username, password });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        const authToken = data.token;
        
        return authToken;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function logout() {
    try {
        // Call logout endpoint if you have one
        await ApiClient.post('/logout', {});
        
        // Clear CSRF token
        ApiClient.clearToken();
        
        // Clear any stored auth data
        // removeCookie(APP_CONSTANTS.COOKIES.AUTH.COOKIE_NAME);
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}