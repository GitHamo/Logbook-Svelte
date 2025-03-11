import type { Book } from '$lib/types';
import { ApiClient } from './client';

export interface LogbookResponse {
    activity: Array<{
        day: string;
        value: number | boolean;
        score: string;
    }>;
    averages: Array<[string, number, number]>;
}

function getAuthHeaders(token: string): HeadersInit {
    return {
        'Authorization': `Bearer ${token}`
    };
}

export async function getBooks(authToken: string): Promise<Book[]> {
    const response = await ApiClient.get('/api/books', {
        headers: getAuthHeaders(authToken)
    });
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
}

export async function createBook(book: Omit<Book, 'id'>, authToken: string): Promise<Book> {
    const response = await ApiClient.post('/api/books', book, {
        headers: getAuthHeaders(authToken)
    });
    if (!response.ok) throw new Error('Failed to create book');
    return response.json();
}

export async function updateBook(book: Book, authToken: string): Promise<Book> {
    const response = await ApiClient.put(`/api/books/${book.id}`, book, {
        headers: getAuthHeaders(authToken)
    });
    if (!response.ok) throw new Error('Failed to update book');
    return response.json();
}

export async function deleteBook(id: string, authToken: string): Promise<void> {
    const response = await ApiClient.delete(`/api/books/${id}`, {
        headers: getAuthHeaders(authToken)
    });
    if (!response.ok) throw new Error('Failed to delete book');
}

export async function getBookLogs(bookId: string, authToken: string): Promise<LogbookResponse> {
    const response = await ApiClient.get(`/api/books/${bookId}/activity`, {
        headers: getAuthHeaders(authToken)
    });
    if (!response.ok) throw new Error('Failed to fetch logbook activity');
    
    const averagesResponse = await ApiClient.get(`/api/books/${bookId}/averages`, {
        headers: getAuthHeaders(authToken)
    });
    if (!averagesResponse.ok) throw new Error('Failed to fetch logbook averages');

    return {
        activity: await response.json(),
        averages: await averagesResponse.json()
    };
}

export async function getBookEntry(bookId: string, day: string, authToken: string): Promise<number | boolean> {
    const response = await ApiClient.get(`/api/books/${bookId}/entries/${day}`, {
        headers: getAuthHeaders(authToken)
    });
    if (!response.ok) throw new Error('Failed to fetch logbook entry');
    return response.json();
}

export async function saveBookEntry(bookId: string, day: string, value: number | boolean, authToken: string): Promise<void> {
    const response = await ApiClient.put(`/api/books/${bookId}/entries/${day}`, { value }, {
        headers: getAuthHeaders(authToken)
    });
    if (!response.ok) throw new Error('Failed to save logbook entry');
} 