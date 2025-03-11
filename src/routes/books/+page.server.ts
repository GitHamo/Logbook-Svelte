import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    try {
        const response = await fetch('/api/books', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${locals.authToken}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch books');
        const books = await response.json();
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

    delete: async ({ request, fetch, locals }) => {
        try {
            const formData = await request.formData();
            const id = formData.get('id');

            const response = await fetch('/api/books', {
                method: 'DELETE',
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${locals.authToken}`
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) throw new Error('Failed to delete book');
            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Failed to delete book' });
        }
    }
}; 