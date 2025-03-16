import { getBookEntry, saveBookEntry } from '$lib/api/entries';
import { withApiAuth } from '$lib/server/api';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const bookId = event.params.bookId;
            const entryDay = event.params.day;
            const entryValue = await getBookEntry(bookId, entryDay, event.locals.authToken as string);
            
            return json(entryValue);
        } catch (err) {
            throw error(500, 'Failed to load logbook day');
        }
    });
};

export const POST: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const bookId = event.params.bookId;
            const entryDay = event.params.day;
            const entryValue = await event.request.json() as { value: number|boolean} | undefined;

            if (!entryValue) {
                throw error(400, 'Entry value is required');
            }

            await saveBookEntry(bookId, entryDay, entryValue, event.locals.authToken as string);

            return json({ success: true });
        } catch (err) {
            throw error(500, 'Failed to save logbook entry');
        }
    });
};