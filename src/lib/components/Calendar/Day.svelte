<script lang="ts">
	import { tooltip } from "$lib/actions/tooltip";

	let { day = [], mode } = $props<{ day: Calendars.Day, mode: Calendars.Mode }>();

	let hasNoValue = $derived(day.value === null);
	let isDisabled = $derived(day?.isOwn === false);
</script>
<button class="calendar-day aspect-square border border-solid border-gray-600 rounded-full text-center hover:border-red-950"
	class:opacity-25={isDisabled}
	class:disabled={isDisabled}
	disabled={isDisabled}
	class:cursor-pointer={!isDisabled}
	style={!isDisabled && !hasNoValue ? `background-color: ${day.color}` : ""}
	use:tooltip={day.label + (day.value ? " (" + day.value + ")" : '')}
>
	<span class="text-xs leading-none"
		class:hidden={mode === 'mini'}
		class:text-white-500={isDisabled}
		class:text-gray-900={hasNoValue}
	>{day.dayNumber}</span>
</button>