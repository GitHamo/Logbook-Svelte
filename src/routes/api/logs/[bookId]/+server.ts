import { getBookStats } from '$lib/api/stats';
import { withApiAuth } from '$lib/server/api';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const bookId = event.params.bookId;
            const bookStats = await getBookStats(bookId, event.locals.authToken as string);

            return json(bookStats);
        } catch (err) {
            throw error(500, 'Failed to load logbook');
        }
    });
};
