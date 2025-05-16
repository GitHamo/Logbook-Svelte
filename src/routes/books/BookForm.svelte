<script lang="ts">
	import { preloaderStore } from '$lib/stores/preloader';
	import type { Book } from '$lib/types';

    const BOOK_TYPES = [
        { id: 10, name: "count" },
        { id: 20, name: "toggle" },
    ];

    const getInitialFormData = (book: Book | null) => ({
        id: book?.id || '',
        name: book?.name || '',
        log_type: book?.log_type || '',
        color: book?.color || '',
    });

    let { book = null, onSave, isSubmitting = false } = $props<{
        book: Book | null;
        onSave: (book: Omit<Book, 'id'> & { id?: string }) => void;
        isSubmitting: boolean;
    }>();

    let bookFormData = $state(getInitialFormData(book));

    function resetForm() {
        bookFormData = getInitialFormData(null);
        book = null;
    }

    async function handleSubmit() {
        isSubmitting = true;
        try {
            preloaderStore.start();
            await onSave({
                id: bookFormData.id || undefined,
                name: bookFormData.name,
                log_type: Number(bookFormData.log_type) as 10 | 20,
                color: bookFormData.color
            });
            resetForm();
        } catch (error) {
            console.error('Failed to save book:', error);
        } finally {
            isSubmitting = false;
            preloaderStore.stop();
        }
    }

    $effect(() => {
        if (book) {
            bookFormData = getInitialFormData(book);
        }
    });
</script>

<form
    class="space-y-4 md:space-y-6"
    onsubmit={(e) => {
        e.preventDefault();
        handleSubmit();
    }}
>
    <input
        type="hidden"
        name="id"
        id="id"
        bind:value={bookFormData.id}
        disabled
        />
    <div class="grid grid-cols-1 md:grid-cols-10 gap-4 w-full">
        <div class="md:col-span-5 w-full">
            <input
                type="text"
                name="name"
                id="name"
                bind:value={bookFormData.name}
                required
                placeholder="Book name..."
                class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>

        <div class="md:col-span-1 w-full">
            <input
                type="color"
                name="color"
                id="color"
                bind:value={bookFormData.color}
                required
                class="w-full cursor-pointer block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
        </div>

        <div class="md:col-span-2 w-full">
            <select
                id="log_types"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 uppercase"
                name="log_type"
                required
                bind:value={bookFormData.log_type}
            >
                <option value="" disabled selected>Choose a log type</option>
                {#each BOOK_TYPES as bookType}
                    <option class="capitalize" value={bookType.id}
                        >{bookType.name}</option
                    >
                {/each}
            </select>
        </div>

        <div class="md:col-span-2 w-full flex justify-end space-x-2">
            <button
                type="submit"
                disabled={isSubmitting}
                class="flex-1 inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Saving...' : (book ? 'Update' : 'Create')}
            </button>
            <button
                type="button"
                onclick={resetForm}
                class="flex-1 inline-flex cursor-pointer justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Cancel
            </button>
        </div>
    </div>
</form>
