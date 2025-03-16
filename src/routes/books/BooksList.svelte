<script lang="ts">
    import type { Book } from '$lib/types';

    const typeTitles: Record<number, string> = {
        10: "count",
        20: "toggle",
    } as const;

    let { books, onEdit, onDelete, isSelecting = false } = $props<{ 
        books: Book[], 
        onEdit: (book: Book) => void,
        onDelete: (book: Book) => void,
        isSelecting?: boolean 
    }>();
</script>

<table class="min-w-full divide-y divide-gray-200">
    <thead class="border-b border-neutral-200 font-medium dark:border-white/10">
        <tr>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
            </th>
        </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
        {#each books as book, i}
            <tr>
                <td class="whitespace-nowrap px-6 py-4 font-medium text-center">{ i + 1 }</td>
                <td class="whitespace-nowrap px-6 py-4 text-left">{book.name}</td>
                <td class="whitespace-nowrap px-6 py-4 text-center">
                    <div
                        class={"w-3 h-3 inline-block"}
                        style={"background-color: " + book.color}
                    ></div>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center">
                    <div
                        class="w-6 h-6 inline-block uppercase bg-neutral-800 text-white font-bold align-middle"
                        >
                        {typeTitles[book.log_type].substring(0, 1)}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                        type="button"
                        onclick={() => {
                            if (!isSelecting) {
                                onEdit(book);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                        class:opacity-50={isSelecting}
                        disabled={isSelecting}
                        class="cursor-pointer text-indigo-600 hover:text-indigo-900"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        class="cursor-pointer text-red-600 hover:text-red-900"
                        onclick={() => {
                            if (confirm(`Are you sure you want to delete "${book.name}"?`)) {
                                onDelete(book);
                            }
                        }}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>