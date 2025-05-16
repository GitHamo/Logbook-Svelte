<script lang="ts">
    import type { Book } from '$lib/types';

    let { books, currentBookId, onSelect } = $props<{ books: Book[], currentBookId: string, onSelect: (book: Book) => void }>();

    async function handleSelect(event: Event) {
        const selectedId = (event.target as HTMLSelectElement).value as string;
        const found = books.find((book: any) => book.id === selectedId);

        if (found) onSelect(found);
    }
</script>

<select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" onchange={handleSelect}>
    <option value="" selected={!currentBookId} disabled>Select a book</option>
    {#each books as book}
        <option value={book.id} selected={book.id === currentBookId}
            >{book.name}</option
        >
    {/each}
</select>
