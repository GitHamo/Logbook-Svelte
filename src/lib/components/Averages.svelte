<script lang="ts">
    let { averages, isLoading = false } = $props<{
        averages: (string|number)[][];
        isLoading: boolean;
    }>();

    // Static lookup for labels and sub-labels
	const averageLabels: Record<number, { label: string; subLabel: string }> = {
		0: { label: "avg.", subLabel: "in total" },
		1: { label: "per day", subLabel: "days" },
		2: { label: "per week", subLabel: "weeks" },
		3: { label: "per month", subLabel: "months" },
		4: { label: "per year", subLabel: "years" },
	};
</script>

{#if isLoading}
	<div>Loading..</div>
{:else}
	{#each averages as dataPoint, index}
		<div class="flex flex-col items-center justify-center">
			<dd
				class="text-gray-500 dark:text-gray-400 uppercase text-[11px]"
			>
				{averageLabels[index].label}
			</dd>
			<dt class="mb-2 text-3xl font-semibold">{dataPoint[1]}</dt>
			<dd
				class="text-gray-500 dark:text-gray-400 uppercase text-[11px]"
			>
				{"over " + dataPoint[2]}&nbsp;{averageLabels[index]
					.subLabel}
			</dd>
		</div>
	{/each}
{/if}
