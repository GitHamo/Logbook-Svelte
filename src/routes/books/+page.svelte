<script lang="ts">
    import type { Book } from '$lib/types';
    import BookForm from './BookForm.svelte';
    import BooksList from './BooksList.svelte';

    let { data } = $props<{ data: { books: Book[] } }>();
    let selectedBook = $state<Book | null>(null);
    let isSubmitting = $state(false);
    let isSelecting = $state(false);
    let latestEditRequest = $state<string | null>(null);

    let books = $state(data.books);

    async function handleEdit(book: Book) {
        const requestId = `edit-${book.id}-${Date.now()}`;
        latestEditRequest = requestId;
        
        try {
            isSelecting = true;
            
            // Artificial delay to prevent rapid switching
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Only update if this is still the latest request
            if (latestEditRequest === requestId) {
                selectedBook = book;
            }
        } finally {
            if (latestEditRequest === requestId) {
                isSelecting = false;
            }
        }
    }

</script>

<header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">Books</h2>
    </div>
</header>
<main>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                <BookForm book={selectedBook} {isSubmitting} />
            </div>
            <div class="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                <div class="flex flex-col">
                    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div class="overflow-hidden">
                                <BooksList {books} onEdit={handleEdit} {isSelecting} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
