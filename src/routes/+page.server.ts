import { APP_CONSTANTS } from "$lib";
import type { Book } from "$lib/types";
import { error, type Cookies } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
    try {
        const currentBook = locals.currentBook as Book;
        const currentBookId = currentBook?.id ?? '';

        const booksResponse = await fetch('/api/books', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${locals.authToken}`
            }
        });

        if (!booksResponse.ok) throw new Error('Failed to fetch books list');

        const books = await booksResponse.json();

        return { currentBookId, books, currentBook };
    } catch (err) {
        console.error(err);
        throw error(500, 'Failed to load books');
    }
};

export const actions: Actions = {
	selectCurrentBook: async ({ request, cookies }: { request: Request; cookies: Cookies; }) => {
		const formData = await request.formData();
		const bookData = Object.fromEntries(formData);

        cookies.set(APP_CONSTANTS.COOKIES.CURRENT_BOOK.COOKIE_NAME, JSON.stringify(bookData), { path: "/", httpOnly: false });

		return { success: true };
	},
};