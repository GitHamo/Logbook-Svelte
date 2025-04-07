<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { APP_CONSTANTS } from '$lib';
    import { authStore } from '$lib/stores/auth';
    import type { ActionResult } from '@sveltejs/kit';
    
    let username = '';
    let password = '';
    let error = '';

    // Handle the form submission
    function handleEnhance({ formData, action, cancel }: { 
        formData: FormData; 
        action: URL; 
        cancel: () => void; 
    }) {
        formData.set('username', username);
        formData.set('password', password);

        return async ({ result }: { result: ActionResult }) => {

            if (result.type === 'success') {

                const token = result?.data?.token;
                if (token) {
                    try {                        
                        // Store auth data on client side
                        localStorage.setItem(APP_CONSTANTS.COOKIES.AUTH.COOKIE_NAME, token);
                        
                        // Update auth store
                        authStore.login(token);
                        
                        goto(APP_CONSTANTS.ROUTES.AFTER_LOGIN);
                    } catch (err) {
                        console.error('Failed to parse user data:', err);
                        error = 'Login failed';
                    }
                } else {
                    error = 'Invalid credentials';
                }
            } else {
                error = 'Login failed';
            }
        };
    }
</script>


<section class="bg-gray-50 dark:bg-gray-900">
    <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
        <div
            class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form 
                    method="POST"
                    use:enhance={handleEnhance}
                    class="space-y-4 md:space-y-6"
                >
                    <div class="mb-4">
                        <label
                            class="block text-gray-700 dark:text-slate-400 text-sm font-bold mb-2"
                            for="email"
                        >
                            Email
                        </label>
                        <input 
                            type="email" 
                            bind:value={username} 
                            placeholder="Email..."
                            class="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                            required 
                        />
                    </div>
                    <div class="mb-6">
                        <label
                            class="block text-gray-700 dark:text-slate-400 text-sm font-bold mb-2"
                            for="password"
                        >
                            Password
                        </label>
                        <input 
                            type="password" 
                            bind:value={password} 
                            placeholder="Password"
                            class="shadow appearance-none border border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required 
                        />
                    </div>
                    {#if error}
                        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-950 dark:text-red-400" role="alert">
                            { error }
                        </div>
                    {/if}
                    <div class="flex items-center justify-between">
                        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer">
                            Login
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</section>
