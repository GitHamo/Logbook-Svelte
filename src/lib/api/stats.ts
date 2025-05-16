import { ApiClient } from './client';

function getAuthHeaders(token: string): HeadersInit {
    return {
        'Authorization': `Bearer ${token}`
    };
}

export interface BookStats {
    activity: Array<{
        day: string;
        value: number | boolean;
        score: string;
    }>;
    activityCalendar: Calendars.YearlyCalendar[];
    averages: Array<[string, number, number]>;
}

export async function getBookStats(bookId: string, authToken: string): Promise<BookStats> {
    try {
        const [activity, activityCalendar, averages] = await Promise.all([
            // Fetch activity
            ApiClient.get(`/api/log/books/${bookId}/activity`, {
                headers: getAuthHeaders(authToken)
            }).then(async (response) => {
                if (!response.ok) throw new Error('Failed to fetch logbook activity');

                // Handle 204 No Content response
                if (response.status === 204) {
                    return [];
                }

                try {
                    const data = await response.json();
                    return data || [];
                } catch (parseError) {
                    console.warn('Empty or invalid activity response, using default empty array');
                    return [];
                }
            }),

            // Fetch activity calendar
            ApiClient.get(`/api/log/books/${bookId}/activity/calendar`, {
                headers: getAuthHeaders(authToken)
            }).then(async (response) => {
                if (!response.ok) throw new Error('Failed to fetch logbook activity calendar');

                // Handle 204 No Content response
                if (response.status === 204) {
                    return [];
                }

                try {
                    const data = await response.json();

                    return data || [];
                } catch (parseError) {
                    console.warn('Empty or invalid activity calendar response, using default empty array');
                    return [];
                }
            }),

            // Fetch averages
            ApiClient.get(`/api/log/books/${bookId}/averages`, {
                headers: getAuthHeaders(authToken)
            }).then(async (response) => {
                if (!response.ok) throw new Error('Failed to fetch logbook averages');

                // Handle 204 No Content response
                if (response.status === 204) {
                    return [];
                }

                try {
                    const data = await response.json();
                    return data || [];
                } catch (parseError) {
                    console.warn('Empty or invalid averages response, using default empty array');
                    return [];
                }
            }),
        ]);

        return {
            activity,
            activityCalendar,
            averages,
        };
    }
    catch (error) {
        console.error('Error fetching logbook data:', error);
        throw error;
    }
}
