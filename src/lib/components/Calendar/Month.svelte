<script lang="ts">
	import CalendarDay from '$lib/components/Calendar/Day.svelte';

	const fullWeekDays: string[] = [
		'Montag',
		'Dienstag',
		'Mittwoch',
		'Donnerstag',
		'Freitag',
		'Samstag',
		'Sonntag'
	];

	let { month, mode } = $props<{ month: Calendars.Month; mode: Calendars.Mode }>();

	// Derive visibleLetters using $derived
	const visibleLetters = $derived(() => {
		switch (mode) {
			case 'mini':
				return 1;
			case 'md':
				return 2;
			default:
				return 0; // show none
		}
	});

	// Derive weekDays based on visibleLetters
	const weekDays = $derived(() =>
		fullWeekDays.map((day) => {
			if (visibleLetters() === 0) return '';
			if (visibleLetters() === null) return day;
			return day.slice(0, visibleLetters());
		})
	);
</script>

<div class="calendar-month col-span-3 md:col-span-2 lg:col-span-1">
	<h3 class="font-semibold text-gray-500 uppercase mb-1"
		class:text-[10px]={mode === 'mini'}
	>{month.label}</h3>
	{#if visibleLetters() !== 0}
		<div class="calendar-week-days grid grid-cols-7 mb-1"
			class:gap-1={mode === 'md'}
			class:gap-px={mode === 'mini'}
		>
			{#each weekDays() as weekDay}
				<span class="inline-block text-xs text-gray-500 uppercase"
					class:text-center={mode === 'mini'}
					class:text-[0.5rem]={mode === 'mini'}
				>{weekDay}</span>
			{/each}
		</div>
	{/if}
	<div class="calendar-weeks grid grid-rows-6"
		class:gap-1={mode === 'md'}
		class:gap-px={mode === 'mini'}
	>
		{#each month.weeks as week}
			<!-- Each row has 7 blue boxes -->
			<div class="calendar-week row-span-3 grid grid-cols-7"
				class:gap-1={mode === 'md'}
				class:gap-px={mode === 'mini'}
			>
				{#each week.days as day}
					<CalendarDay {day} {mode} />
				{/each}
			</div>
		{/each}
	</div>
</div>
