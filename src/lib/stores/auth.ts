import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const COOKIE_KEY_USER = 'current_user';

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthStore>({
        user: null,
        isAuthenticated: false
    });

    return {
        subscribe,
        login: (user: User) => {
            set({ user, isAuthenticated: true });

            // Only use localStorage in browser
            if (browser) {
                try {
                    localStorage.setItem(COOKIE_KEY_USER, JSON.stringify(user));
                } catch (error) {
                    console.error('Failed to save user to localStorage', error);
                }
            }
        },
        logout: () => {
            set({ user: null, isAuthenticated: false });
            
            // Only use localStorage in browser
            if (browser) {
                try {
                    localStorage.removeItem(COOKIE_KEY_USER);
                } catch (error) {
                    console.error('Failed to remove user from localStorage', error);
                }
            }
        },
        init: () => {
            // Only attempt to read from localStorage in browser
            if (browser) {
                try {
                    const storedUser = localStorage.getItem(COOKIE_KEY_USER);

                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        set({ 
                            user, 
                            isAuthenticated: true 
                        });
                    }
                } catch (error) {
                    console.error('Failed to initialize auth from localStorage', error);
                }
            }
        }
    };
}

export const authStore = createAuthStore();