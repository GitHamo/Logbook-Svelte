import { createBook, deleteBook, updateBook } from '$lib/api/books';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    create: async ({ request, fetch, locals }) => {
        try {
            const formData = await request.formData();
            const book: Book = {
                name: formData.get('name') as string,
                log_type: formData.get('log_type') || 0 as number,
                color: formData.get('color') as string,
            };

            await createBook(book, locals.authToken as string);

            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Failed to create book' });
        }
    },

    update: async ({ request, fetch, locals }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id') as string;
            const book = {
                id,
                name: formData.get('name') as string,
                log_type: formData.get('log_type') || 0 as number,
                color: formData.get('color') as string,
            };

            await updateBook(book, locals.authToken as string);

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
