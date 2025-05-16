<script lang="ts">
	import { preloaderStore } from '$lib/stores/preloader.js';
	import type { Book } from '$lib/types';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import BookForm from './BookForm.svelte';
	import BooksList from './BooksList.svelte';

    let booksState = $state({
        list: [],
        selected: null,
        isSubmitting: false
    });

    let isSelecting = $state(false);
    let latestEditRequest = $state<string | null>(null);

    async function handleEdit(book: Book) {
        const requestId = `edit-${book.id}-${Date.now()}`;
        latestEditRequest = requestId;

        try {
            isSelecting = true;

            // Artificial delay to prevent rapid switching
            await new Promise(resolve => setTimeout(resolve, 100));

            // Only update if this is still the latest request
            if (latestEditRequest === requestId) {
                booksState.selected = book;
            }
        } finally {
            if (latestEditRequest === requestId) {
                isSelecting = false;
            }
        }
    }

    async function fetchBooks() {
        try {
			preloaderStore.start();

            const response = await fetch('/api/books');

            if (!response.ok) throw new Error('Failed to fetch books');

            booksState.list = await response.json();

        } catch (err) {
            console.error(err);

            throw error(500, 'Failed to load books');
        }

        preloaderStore.stop();
    }

    async function handleSave(book: Book) {
        preloaderStore.start();

        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });

        if (!response.ok) {
            throw error(500, 'Failed to save book');
        }

        await fetchBooks();

        booksState.selected = null;

        preloaderStore.stop();
    }

    async function handleDelete(book: Book) {
        preloaderStore.start();

        const response = await fetch('/api/books', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: book.id })
        });

        if (!response.ok) {
            throw error(500, 'Failed to delete book');
        }

        await fetchBooks();

        preloaderStore.stop();
    }

    onMount(async () => {
        await fetchBooks();
    });

</script>
<svelte:head>
	<title>Books - Logbook</title>
</svelte:head>
<header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">Books</h2>
    </div>
</header>
<main>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                <BookForm book={booksState.selected} onSave={handleSave} isSubmitting={booksState.isSubmitting} />
            </div>
            <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                <div class="flex flex-col">
                    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div class="overflow-hidden">
                                <BooksList books={booksState.list} onEdit={handleEdit} onDelete={handleDelete} isSelecting={isSelecting} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
