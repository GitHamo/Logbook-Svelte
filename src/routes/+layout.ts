import { authStore } from '$lib/stores/auth';

export const load = async () => {
    authStore.init();
    return {};
};
