<script lang="ts">
	import { onDestroy } from "svelte";

  let { todayValue, isLoading, onSave } = $props<{ todayValue: boolean, isLoading: boolean, onSave: (value: boolean) => void }>();
  let isActive = $state(Boolean(todayValue.value));

	const unsubscribe = todayValue.subscribe((value: boolean) => {
		isActive = value;
	});

	onDestroy(() => {
		unsubscribe();
	});

  const classNames = [
    "rounded-tr-none",
    "rounded-bl-xl",
    "rounded-br-xl",
    "sm:rounded-bl-none",
    "sm:rounded-tr-xl",
    "sm:rounded-br-xl",
    "md:rounded-tr-none",
    "md:rounded-bl-xl",
    "md:rounded-br-xl",
  ].join(" ");
</script>

<div class="w-full h-full h-16">
  <button
    class={"cursor-pointer w-full h-full transition-all font-bold text-3xl disabled:bg-gray-200 disabled:text-gray-400 " + classNames}
    class:bg-green-300={isActive}
    class:bg-red-300={!isActive}
    class:text-green-800={isActive}
    class:text-red-800={!isActive}
    onclick={() => onSave(!isActive)}
    disabled={isLoading}
  >
    {isActive ? "Yes" : "No"}
  </button>
</div>