import type { Moment } from 'moment';
import type { LogbookResponse } from './books';
import { ApiClient } from './client';

const URL_DATE_FORMAT = 'DD-MM-YYYY';

function getAuthHeaders(token: string): HeadersInit {
    return {
        'Authorization': `Bearer ${token}`
    };
}

export async function getBookStats(bookId: string, authToken: string): Promise<LogbookResponse> {
    const activityResponse = await ApiClient.get(`/api/books/${bookId}/activity`, {
        headers: getAuthHeaders(authToken)
    });
    if (!activityResponse.ok) throw new Error('Failed to fetch logbook activity');
    const activity = await activityResponse.json();

    const averagesResponse = await ApiClient.get(`/api/books/${bookId}/averages`, {
        headers: getAuthHeaders(authToken)
    });
    if (!averagesResponse.ok) throw new Error('Failed to fetch logbook averages');
    const averages = await averagesResponse.json();

    return {
        activity,
        averages
    };
}

export async function getBookEntry(bookId: string, day: Moment, authToken: string): Promise<number | boolean> {
    const formattedDay = day.format(URL_DATE_FORMAT);
    const response = await ApiClient.get(`/api/books/${bookId}/entries/${formattedDay}`, {
        headers: getAuthHeaders(authToken)
    });
    if (!response.ok) throw new Error('Failed to fetch logbook entry');
    const data = await response.json();
    return data?.value;
}

export async function saveBookEntry(
    bookId: string, 
    day: Moment, 
    value: number | boolean, 
    authToken: string
): Promise<void> {
    const formattedDay = day.format(URL_DATE_FORMAT);
    const response = await ApiClient.put(
        `/api/books/${bookId}/entries/${formattedDay}`,
        { value },
        { headers: getAuthHeaders(authToken) }
    );
    if (!response.ok) throw new Error('Failed to save logbook entry');
} 