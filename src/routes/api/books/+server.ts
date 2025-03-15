import { createBook, deleteBook, getBooks, updateBook } from '$lib/api/books';
import { withApiAuth } from '$lib/server/api';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const books = await getBooks(event.locals.authToken as string);

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
            throw error(500, 'Failed to load books');
        }
    });
};

export const POST: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const book = await event.request.json();
            const newBook = await createBook(book, event.locals.authToken as string);

            return json(newBook);
        } catch (err) {
            throw error(500, 'Failed to create book');
        }
    });
};

export const PUT: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            const book = await event.request.json();
            
            if (!book.id) throw new Error('Book ID is required');

            const updatedBook = await updateBook(book, event.locals.authToken as string);

            return json(updatedBook);
        } catch (err) {
            throw error(500, 'Failed to update book');
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