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
export interface LogbooksPaginatedResponse<T> {
    items: T[];
    per_page: number;
    total: number;
}

function getAuthHeaders(token: string): HeadersInit {
    return {
        'Authorization': `Bearer ${token}`
    };
}

export async function getBooks(authToken: string, currentPage: number = 1): Promise<LogbooksPaginatedResponse<Book>> {
    const response = await ApiClient.get(`/api/log/books?page=${currentPage}`, {
        headers: getAuthHeaders(authToken)
    });

    if (!response.ok) throw new Error('Failed to fetch books');

    const data = await response.json() as LogbooksPaginatedResponse<Book>;

    return data;
}

export async function createBook(book: Omit<Book, 'id'>, authToken: string): Promise<void> {
    const response = await ApiClient.post('/api/log/books', book, {
        headers: getAuthHeaders(authToken)
    });

    if (!response.ok) throw new Error('Failed to create book');
}

export async function updateBook(book: Book, authToken: string): Promise<void> {
    const response = await ApiClient.put(`/api/log/books/${book.id}`, book, {
        headers: getAuthHeaders(authToken)
    });

    if (!response.ok) throw new Error('Failed to update book');
}

export async function deleteBook(id: string, authToken: string): Promise<void> {
    const response = await ApiClient.delete(`/api/log/books/${id}`, {
        headers: getAuthHeaders(authToken)
    });

    if (!response.ok) throw new Error('Failed to delete book');
}
