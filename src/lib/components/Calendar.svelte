<script lang="ts">
	import CalendarMonth from '$lib/components/Calendar/Month.svelte';

	let { calendar, mode = 'md' } = $props<{ calendar: Calendars.YearlyCalendar, mode: Calendars.Mode }>();

</script>

<div class="calendar w-full">
    <h1>{calendar.label}</h1>
    <!-- Container Grid: 6 columns, each column is a flex column -->
    <div class="calendar-year grid"

        class:gap-4={mode === 'md'}
        class:grid-cols-6={mode === 'md'}

        class:gap-2={mode === 'mini'}
        class:grid-cols-12={mode === 'mini'}

    >
        {#each calendar.months as month}
        <CalendarMonth {month} {mode} />
        {/each}
    </div>
</div>
