import { deleteBook, getBooks } from '$lib/api/books';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    try {
        const books = await getBooks(locals.authToken as string);

        return { books };
    } catch (err) {
        console.error(err);
        throw error(500, 'Failed to load books');
    }
};

export const actions: Actions = {
    create: async ({ request, fetch, locals }) => {
        try {
            const formData = await request.formData();
            const book = {
                title: formData.get('title'),
                author: formData.get('author'),
                isbn: formData.get('isbn')
            };

            const response = await fetch('/api/books', {
                method: 'POST',
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${locals.authToken}`
                },
                body: JSON.stringify(book)
            });

            if (!response.ok) throw new Error('Failed to create book');
            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Failed to create book' });
        }
    },

    update: async ({ request, fetch, locals }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id');
            const book = {
                id,
                title: formData.get('title'),
                author: formData.get('author'),
                isbn: formData.get('isbn')
            };

            const response = await fetch('/api/books', {
                method: 'PUT',
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${locals.authToken}`
                },
                body: JSON.stringify(book)
            });

            if (!response.ok) throw new Error('Failed to update book');
            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Failed to update book' });
        }
    },

    delete: async ({ request, locals }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id');

            await deleteBook(id as string, locals.authToken as string);

            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Failed to delete book' });
        }
    }
}; 