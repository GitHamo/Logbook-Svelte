<script lang="ts">
    import { goto } from '$app/navigation';
    import { login } from '$lib/api/auth';
    import { authStore } from '$lib/stores/auth';
    
    let username = '';
    let password = '';
    let error = '';

    async function handleLogin() {
        const user = await login(username, password);
        if (user) {
            authStore.login(user);
            localStorage.setItem('user', JSON.stringify(user));
            goto('/books');
        } else {
            error = 'Invalid credentials';
        }
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
                <form on:submit|preventDefault={handleLogin} class="space-y-4 md:space-y-6">
                    <div class="mb-4">
                        <label
                            class="block text-gray-700 text-sm font-bold mb-2"
                            for="email"
                        >
                            Email
                        </label>
                        <input 
                            type="text" 
                            bind:value={username} 
                            placeholder="Email..."
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required 
                        />
                    </div>
                    <div class="mb-6">
                        <label
                            class="block text-gray-700 text-sm font-bold mb-2"
                            for="password"
                        >
                            Password
                        </label>
                        <input 
                            type="password" 
                            bind:value={password} 
                            placeholder="Password"
                            class="shadow appearance-none border border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required 
                        />
                    </div>
                    {#if error}
                        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                            { error }
                        </div>
                    {/if}
                    <div class="flex items-center justify-between">
                        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</section>
