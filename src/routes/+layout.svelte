<script lang="ts">
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import Preloader from '$lib/components/Preloader.svelte';
    import { authStore } from '$lib/stores/auth';
    import "../app.css";

    // Use $effect for side effects
    $effect(() => {
        // Only redirect on client-side
        if (browser && !$authStore.isAuthenticated && page.url.pathname !== '/login') {
            goto('/login');
        }
    });

	const NAV_ITEM_CLASS = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none uppercase tracking-widest font-semibold";
	const NAV_ITEM_ACTIVE_CLASS = "border-indigo-400 text-gray-900 focus:border-indigo-700";
	const NAV_ITEM_NOT_ACTIVE_CLASS = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300";

	/**
	 * @param {string} route
	 */
	 const isActive = (route: string) => page.url.pathname === route;
	/**
	 * @param {string} route
	 */
	const navItemClassNames = (route: string) => `${NAV_ITEM_CLASS} ${isActive(route) ? NAV_ITEM_ACTIVE_CLASS : NAV_ITEM_NOT_ACTIVE_CLASS}`;

	let { children } = $props();

</script>

<div class="min-h-screen bg-gray-100">
	{#if $authStore.isAuthenticated}
	<nav class="bg-white border-b border-gray-100">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16 px-6">
				<div class="flex">
					<div
						class="hidden space-x-8 sm:-my-px sm:flex"
					>
						<a class={navItemClassNames('/')} href="/">Home</a>
						<a class={navItemClassNames('/books')} href="/books">Books</a>
						<form
							action="/logout"
							method="POST"
							class="inline-flex"
							onsubmit={(e) => {
								e.preventDefault();
								authStore.logout();
								(e.target as HTMLFormElement).submit();
							}}
						>
							<button
								type="submit"
								class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none uppercase tracking-widest border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 cursor-pointer font-semibold"
							>
								Logout
							</button>
						</form>
					</div>
				</div>

				<div class="hidden sm:flex sm:items-center sm:ms-6">
					<div class="ms-3 relative">
						<div class="inline-flex rounded-md">
							<Preloader />
						</div>
					</div>
				</div>
			</div>
			<!-- Mobile Menu (shown only on small screens) -->
			<div class="sm:hidden block space-y-1 px-2 pt-2 pb-3">
				<a class={navItemClassNames('/')} href="/">Home</a>
				<a class={navItemClassNames('/books')} href="/books">Books</a>
				<form
					action="/logout"
					method="POST"
					class="inline-flex"
					onsubmit={(e) => {
						e.preventDefault();
						authStore.logout();
						(e.target as HTMLFormElement).submit();
					}}
				>
					<button
						type="submit"
						class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none uppercase tracking-widest border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 cursor-pointer font-semibold"
					>
						Logout
					</button>
				</form>
			</div>

		</div>
	</nav>
	{/if}
	{@render children()}
</div>
