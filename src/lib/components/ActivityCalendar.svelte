<script lang="ts">
    import moment, { type Moment } from 'moment';
    let { today, activity, isLoading = false, onSelect } = $props<{
        today: Moment;
        activity: Record<string, number|boolean>;
        isLoading: boolean;
        onSelect: (day: string) => void;
    }>();
	// console.log(activity);
</script>

{#if isLoading}
	<div>Loading..</div>
{:else}
	<div class="block flex flex-wrap">
		{#each activity as dataPoint}
			<button
				class={"day flex m-0.25 p-1.5 cursor-pointer border border-solid hover:border-red-500 " + (dataPoint.day === today.format('DD/MM/YYYY') ? 'border-red-500' : 'border-sky-200')}
				style={`background-color: ${dataPoint.score}`}
				onclick={() => onSelect(moment(dataPoint.day, 'DD/MM/YYYY'))}
				title={dataPoint.day + " (" + dataPoint.value + ")"}
				aria-label={dataPoint.day + " (" + dataPoint.value + ")"}
			>
			</button>
		{/each}
	</div>
{/if}
