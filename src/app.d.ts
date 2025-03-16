// See https://svelte.dev/docs/kit/types#app.d.ts
/// <reference types="$lib/types" />

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
		}

		// interface Error {}

		interface Locals {
			authToken: string | null;
			currentBook: Book | null;
		}

		interface PageData {
			user?: User | null;
			currentBook?: Book | null;
		}

		interface PageState {
			isLoading?: boolean;
		}

		// interface Platform {}
	}
}

export { };

