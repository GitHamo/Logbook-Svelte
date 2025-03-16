import { ApiClient } from './client';

function getAuthHeaders(token: string): HeadersInit {
    return {
        'Authorization': `Bearer ${token}`
    };
}

export async function getBookActivity(bookId: string, authToken: string) {
    try {
        const response = await ApiClient.get(`/api/log/books/${bookId}/activity`, {
            headers: getAuthHeaders(authToken)
        });
        
        if (!response.ok) throw new Error('Failed to fetch logbook activity');
        
        return response.json();
    }
    catch (error) {
        console.error('Error fetching logbook activity:', error);
        throw error;
    }
}

export async function getBookAverages(bookId: string, authToken: string) {
    try {
        const response = await ApiClient.get(`/api/log/books/${bookId}/averages`, {
            headers: getAuthHeaders(authToken)
        });

        if (!response.ok) throw new Error('Failed to fetch logbook averages');

        return response.json();
    }
    catch (error) {
        console.error('Error fetching logbook averages:', error);
        throw error;
    }
}