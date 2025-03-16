import { ApiClient } from './client';

function getAuthHeaders(token: string): HeadersInit {
    return {
        'Authorization': `Bearer ${token}`
    };
}

export async function getBookEntry(bookId: string, day: string, authToken: string): Promise<number | boolean> {
    const response = await ApiClient.get(`/api/log/books/${bookId}/entries/${day}`, {
        headers: getAuthHeaders(authToken)
    });
    if (!response.ok) throw new Error('Failed to fetch logbook entry');
    return response.json();
}

export async function saveBookEntry(bookId: string, day: string, value: { value: number | boolean }, authToken: string): Promise<void> {
    const response = await ApiClient.put(`/api/log/books/${bookId}/entries/${day}`, value, {
        headers: getAuthHeaders(authToken)
    });

    if (!response.ok) throw new Error('Failed to save logbook entry');
}
