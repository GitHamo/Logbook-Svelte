// place files you want to import through the `$lib` alias in this folder.
// Centralized exports from lib modules

// Export authentication-related utilities
export { authStore } from './stores/auth';

export {
    login,
    logout
} from './api/auth';


// Optional: Add any global type definitions or interfaces
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

// Optional: Add any utility functions that might be used across the application
export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export const { APP_CONSTANTS } = await import('./constants');
