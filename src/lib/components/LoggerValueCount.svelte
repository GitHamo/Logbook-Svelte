<script lang="ts">
	import { onDestroy } from "svelte";

    let { todayValue, isLoading, onSave } = $props<{ todayValue: number, isLoading: boolean, onSave: (value: number) => void }>();
    let count = $state(todayValue.value);

    const saveValue = () => {
        onSave(count);
    };

    const increment = () => {
        count++;

        saveValue();
    };

    const decrement = () => {
        count--;

        saveValue();
    };

    const reset = () => {
        count = 0;

        saveValue();
    };

	const unsubscribe = todayValue.subscribe((value: number) => {
		count = value;
	});

	onDestroy(() => {
		unsubscribe();
	});

</script>

<div class="grid md:row-span-2 grid-cols-6">
    <input
        type="number"
        class={"input-number-as-text col-span-6 p-1 text-center font-bold block text-center text-6xl disabled:opacity-50 disabled:cursor-not-allowed"}
        bind:value={count}
        disabled={isLoading}
        onblur={(e) => saveValue()}
    />
</div>

<div class="grid grid-cols-3">
    <button
        class={"cursor-pointer rounded-bl-xl bg-slate-400 hover:bg-blue-300 px-2.5 py-1.5 text-xl font-bold text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"}
        disabled={isLoading}
        onclick={decrement}
    >
        -1
    </button>
    <button
        class="cursor-pointer cdisabled:opacity-50 bg-slate-400 hover:bg-red-400 text-red-900 text-xs font-semibold uppercase justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
        onclick={reset}
    >
        Reset
    </button>
    <button
        class={"cursor-pointer rounded-br-xl  bg-slate-400 hover:bg-blue-300 px-2.5 py-1.5 text-xl font-bold text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"}
        disabled={isLoading}
        onclick={increment}
    >
        +1
    </button>
</div>
