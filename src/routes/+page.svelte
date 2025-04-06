<script lang="ts">
	import ActivityCalendar from '$lib/components/ActivityCalendar.svelte';
	import Averages from '$lib/components/Averages.svelte';
	import BooksDropdown from '$lib/components/BooksDropdown.svelte';
	import LogbookLogger from '$lib/components/Logger.svelte';
	import type { Book } from '$lib/types';
	import moment, { type Moment } from 'moment';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Types and Interfaces
	interface LogEntry {
		value: number | boolean;
	}

	interface BookData {
		averages: number[];
		activity: Record<string, number | boolean>;
	}

	// Constants
	const DATE_FORMAT = 'DD-MM-YYYY';
	const API_ENDPOINTS = {
		logs: (bookId: string) => `/api/logs/${bookId}`,
		logEntry: (bookId: string, day: string) => `/api/logs/${bookId}/${day}`,
		selectBook: '?/selectCurrentBook'
	} as const;

	// Props and State
	let { data } = $props();
	let currentBookId = $state(data.currentBookId);
	let books = $derived(data.books);
	let currentBook = $state(data.currentBook);
	let currentBookData = $state<BookData>({
		averages: [],
		activity: {}
	});
	let isLoading = $state(false);
	let today = $state(moment());
	let logbookTypeId = $derived(currentBook?.log_type);
	const logbookEntryValue = writable<number | boolean>(0);

	// Track latest requests to prevent race conditions
	let latestBookId = $state<string | null>(null);
	let latestDayRequest = $state<string | null>(null);
	let latestSaveRequest = $state<string | null>(null);

	// Error handling
	async function handleError(error: Error, context: string) {
		console.error(`Error in ${context}:`, error);
		isLoading = false;
		// Could add toast/notification system here
	}

	async function navigateDayWithArrowKeys(event: KeyboardEvent) {
		const key = event.code;

        if (key === 'ArrowLeft') {
            today = today.clone().subtract(1, 'day');
            await fetchLogbookEntryValue();
        } else if (key === 'ArrowRight') {
            today = today.clone().add(1, 'day');
            await fetchLogbookEntryValue();
        }
    }

	async function handleSelectCurrentDay(day: Moment) {
		today = day;
		await fetchLogbookEntryValue();
	}

    async function handleSelectCurrentBook(book: Book) {
        try {
            isLoading = true;
            const thisBookId = book.id;
            latestBookId = thisBookId;  // Track this selection

            const formData = new URLSearchParams();
            Object.entries(book).forEach(([key, value]) => {
                formData.append(key, String(value));
            });

            // First, update the server
            const response = await fetch('?/selectCurrentBook', {
                method: 'POST',
                body: formData.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update book selection');
            }

            // Check if this is still the latest selection
            if (thisBookId !== latestBookId) {
                return; // A newer selection was made, abort this one
            }

            // Atomic update of local state
            const newToday = moment();
            const updates = () => {
                currentBookId = thisBookId;
                currentBook = book;
                today = newToday;
            };
            updates();

            // Fetch data sequentially to ensure order
            await fetchCurrentBookData();
            
            // Check again if this is still the latest selection
            if (thisBookId !== latestBookId) {
                return; // A newer selection was made, abort this one
            }

            await fetchLogbookEntryValue();

        } catch (error) {
            console.error('Error updating book selection:', error);
        } finally {
            if (latestBookId === book.id) {
                isLoading = false;
            }
        }
    }

	async function fetchCurrentBookData() {
		if (!currentBookId) return;
		
		try {
			const response = await fetch(API_ENDPOINTS.logs(currentBookId));

			if (!response.ok) throw new Error('Failed to load logbook data');

			const data = await response.json();
			// Only update if the response is for the current book
			if (currentBookId === latestBookId) {
				currentBookData = data as BookData;
			}
		} catch (error) {
			handleError(error as Error, 'fetching book data');
		}
	}

    async function fetchLogbookEntryValue() {
        if (!currentBookId) return;

		const day = today.format(DATE_FORMAT);
		const thisRequest = `${currentBookId}-${day}`;
		latestDayRequest = thisRequest;

		try {
			const response = await fetch(API_ENDPOINTS.logEntry(currentBookId, day));
			if (!response.ok) throw new Error('Failed to load logbook entry');

			const entryValue = (await response.json()) as LogEntry;
			// Only update if this is still the latest request for this book and day
			if (latestDayRequest === thisRequest && currentBookId === latestBookId) {
				logbookEntryValue.set(entryValue.value);
			}
		} catch (error) {
			handleError(error as Error, 'fetching log entry');
		}
	}

    async function saveLogbookEntryValue(newValue: number | boolean) {
        if (!currentBookId) return;

		const day = today.format(DATE_FORMAT);
		const thisRequest = `${currentBookId}-${day}-${moment().unix()}`;
		latestSaveRequest = thisRequest;

		try {
			isLoading = true;
			const response = await fetch(API_ENDPOINTS.logEntry(currentBookId, day), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ value: newValue }),
			});

            if (!response.ok) throw new Error('Failed to save logbook entry');

			// Only fetch new data if this is still the latest save request and book
			if (latestSaveRequest === thisRequest && currentBookId === latestBookId) {
				logbookEntryValue.set(newValue);

				await fetchCurrentBookData();
			}
		} catch (error) {
			handleError(error as Error, 'saving log entry');
		} finally {
			if (latestSaveRequest === thisRequest) {
				isLoading = false;
			}
		}
	}

	onMount(async () => {
		try {
			if (currentBookId) {
				latestBookId = currentBookId;
				await Promise.all([
					fetchCurrentBookData(),
					fetchLogbookEntryValue()
				]);
			}
		} catch (error) {
			handleError(error as Error, 'initial load');
		}

        // Add keyboard event listener
        window.addEventListener('keydown', navigateDayWithArrowKeys);
        
        // Cleanup listener when component is destroyed
        return () => {
            window.removeEventListener('keydown', navigateDayWithArrowKeys);
        };
    });
</script>

<header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="rounded-lg bg-white py-4 px-6">
            <BooksDropdown {books} {currentBookId} onSelect={handleSelectCurrentBook} />
        </div>
    </div>
</header>
<main>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

            {#if currentBook}
            <div class="columns-6 grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 px-5">
                <div class={"w-full p-2"}>
                    <div class={"rounded-lg bg-white p-6 h-full"}>
                        <LogbookLogger {isLoading} {today} typeId={logbookTypeId} todayValue={logbookEntryValue} onSelect={handleSelectCurrentDay} onSave={saveLogbookEntryValue} />
                    </div>
                </div>
                <div class={"w-full p-2"}>
                    <div class={"calendar rounded-lg bg-white p-6 h-full"}>
                        <ActivityCalendar {isLoading} {today} activity={currentBookData.activity} onSelect={handleSelectCurrentDay} />
                    </div>
                </div>
                <div class={"w-full p-2"}>
                    <div class={"averages rounded-lg bg-white p-6 h-full grid grid-cols-3"}>
						<Averages averages={currentBookData.averages} {isLoading} />
                    </div>
                </div>
            </div>
            {:else}
                <div class="rounded-lg bg-white p-6 h-full">
                    No book selected
                </div>
            {/if}
        </div>
    </div>
</main>