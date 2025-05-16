<script lang="ts">
    import type { Moment } from "moment";

    let { today, isLoading, onSelect } = $props<{ today: Moment, isLoading: boolean, onSelect: (day: Date) => void }>();

    const setToday = (days: number) => {
        onSelect(today.clone().add(days, "days"));
    };
</script>

<div class="grid grid-cols-6 h-full">
    <button
        class={"cursor-pointer rounded-tl-xl bg-slate-400 hover:bg-blue-300 px-2.5 py-1.5 text-5xl font-bold text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"}
        onclick={() => setToday(-1)}
        disabled={isLoading}
        >
        &lt;
    </button>
    <div class={'col-span-4 text-center self-center text-3xl' + (isLoading ? ' opacity-50 cursor-not-allowed' : '')}>
        <span class="font-bold">{today.format('dddd')}, </span>
        {today.format('DD/MM/YYYY')}
    </div>
    <button
        class={"cursor-pointer rounded-tr-xl bg-slate-400 hover:bg-blue-300 px-2.5 py-1.5 text-5xl font-bold text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"}
        onclick={() => setToday(1)}
        disabled={isLoading}
        >
        &gt;
    </button>
</div>
