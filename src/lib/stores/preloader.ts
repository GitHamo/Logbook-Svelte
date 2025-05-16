import { derived, writable, type Readable } from 'svelte/store';

interface PreloaderState {
    ongoing: boolean;
    ongoingRequestsCount: number;
    startedAt: number | null;
}

function createPreloaderStore() {
    const { subscribe, set, update } = writable<PreloaderState>({
        ongoing: false,
        ongoingRequestsCount: 0,
        startedAt: null,
    });

    // Derived store for `ongoing`
    const ongoing: Readable<boolean> = derived(
        { subscribe },
        ($state) => $state.ongoingRequestsCount > 0
    );

    return {
        subscribe,
        ongoing,
        start: () => update((state) => {
            if (state.startedAt !== null) {
                // don't start again if there's already an ongoing request
                return {
                    ...state,
                    ongoingRequestsCount: state.ongoingRequestsCount + 1,
                };
            }

            // start tracking the first request
            return {
                ...state,
                ongoing: true,
                ongoingRequestsCount: 1,
                startedAt: Date.now(),
            };
        }),

        stop: () => update((state) => {
            if(state.ongoingRequestsCount > 1) {
                // only reduce the count if there are more than 1 ongoing requests
                return {
                    ...state,
                    ongoingRequestsCount: state.ongoingRequestsCount - 1
                }
            }

            // stop tracking
            return {
                ...state,
                ongoing: false,
                ongoingRequestsCount: 0,
                startedAt: null,
            };
        }),
        init: () => {
            set({
                ongoing: false,
                ongoingRequestsCount: 0,
                startedAt: null
            });
        },
    }
}

export const preloaderStore = createPreloaderStore();
