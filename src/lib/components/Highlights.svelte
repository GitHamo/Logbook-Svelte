<script lang="ts">
	import type { BookHighlights } from '$lib/api/stats';

	let { highlights }: { highlights: BookHighlights } = $props();
</script>

<div class="flex flex-col items-center">
	<dd class="text-[11px] text-gray-500 uppercase dark:text-gray-400">Longest Streak</dd>
	<dt class="mb-2 text-3xl font-semibold">{highlights.longestStreak?.length ?? '-'}</dt>
	<dd class="text-[11px] text-gray-500 uppercase dark:text-gray-400">days</dd>
</div>
<div class="flex flex-col items-center">
	<dd class="text-[11px] text-gray-500 uppercase dark:text-gray-400">Highest</dd>
	<dt class="mb-2 text-3xl font-semibold">{highlights.max?.value ?? '-'}</dt>
	<dd class="text-[11px] text-gray-500 uppercase dark:text-gray-400">{highlights.max?.day ?? ''}</dd>
</div>
<div class="flex flex-col items-center">
	<dd class="text-[11px] text-gray-500 uppercase dark:text-gray-400">Lowest</dd>
	<dt class="mb-2 text-3xl font-semibold">{highlights.min?.value ?? '-'}</dt>
	<dd class="text-[11px] text-gray-500 uppercase dark:text-gray-400">{highlights.min?.day ?? ''}</dd>
</div>
