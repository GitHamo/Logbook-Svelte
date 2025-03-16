import { createBook, deleteBook, getBooks, updateBook } from '$lib/api/books';
import { withApiAuth } from '$lib/server/api';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const authToken = event.locals.authToken as string;
            const books: Book[] = [];

            let currentPage = 1;
            let lastPage = 1;

            do {
                const fetched = await getBooks(authToken, currentPage);

                books.push(...fetched.items);

                currentPage++;
                // Calculate last page from total items and items per page
                lastPage = Math.ceil(fetched.total / fetched.per_page);
            } while (currentPage <= lastPage);

            // if (!response.ok) return json(
            //     [
            //         {
            //             "id": "9d0639c2-0921-4772-9069-e19455a625ac",
            //             "log_type": 10,
            //             "name": "Jobz",
            //             "color": ""
            //         },
            //         {
            //             "id": "9d8b4977-021a-4cf3-ae41-3cee7d57a7d0",
            //             "log_type": 20,
            //             "name": "getsome",
            //             "color": "#ff0000"
            //         },
            //         {
            //             "id": "9d90a153-9137-4e3a-9f5e-c9fda040b3fa",
            //             "log_type": 20,
            //             "name": "Badfilternreinigung",
            //             "color": "#c0c0c0"
            //         }
            //     ]

            // );
            return json(books);
        } catch (err) {
            console.log('error', err);
            throw error(500, 'Failed to load books');
        }
    });
};

export const POST: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const book = await event.request.json();

            if (book.id) {
                await updateBook(book, event.locals.authToken as string);
            }
            else {
                await createBook(book, event.locals.authToken as string);
            }

            return new Response(null, { status: 204 });
        } catch (err) {
            throw error(500, 'Failed to save book');
        }
    });
};

export const DELETE: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const { id } = await event.request.json();
            if (!id) throw new Error('Book ID is required');

            await deleteBook(id, event.locals.authToken as string);

            return json({ success: true });
        } catch (err) {
            throw error(500, 'Failed to delete book');
        }
    });
}; 