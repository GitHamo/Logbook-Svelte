import { getBookActivity, getBookAverages } from '$lib/api/stats';
import { withApiAuth } from '$lib/server/api';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const bookId = event.params.bookId;
            const activity = await getBookActivity(bookId, event.locals.authToken as string);
            const averages = await getBookAverages(bookId, event.locals.authToken as string);

            return json({
                activity,
                averages,
            });
        } catch (err) {
            throw error(500, 'Failed to load logbook');
        }
    });
};