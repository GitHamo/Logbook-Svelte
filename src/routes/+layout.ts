import { authStore } from '$lib/stores/auth';
import { preloaderStore } from '$lib/stores/preloader';

export const load = async () => {
    preloaderStore.init();
    authStore.init();
    return {};
};
