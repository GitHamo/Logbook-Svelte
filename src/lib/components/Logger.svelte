<script lang="ts">
	import type { LogType } from "$lib/types";
	import LoggerDay from "./LoggerDay.svelte";
	import LoggerCount from "./LoggerValueCount.svelte";
	import LoggerToggle from "./LoggerValueToggle.svelte";

    type LoggerComponent = {
        component: typeof LoggerCount | typeof LoggerToggle;
        title: string;
        value: number | boolean;
    };

    const availableLoggerComponents: Record<LogType, LoggerComponent> = {
        10: {
            component: LoggerCount,
            title: "count",
            value: 0,
        },
        20: {
            component: LoggerToggle,
            title: "toggle",
            value: false,
        },
    } as const;

    let { typeId = 10, ...data } = $props();

    const currentLogger = $derived(availableLoggerComponents[typeId as LogType]);
</script>

<div class="space-y-4 h-full">
    <div id="logbook-logger" class="h-full border-10 border-slate-400 rounded-3xl shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 lg:grid-cols-7 grid-rows-2">
        <div class="md:col-span-12 lg:col-span-12 grid">
            <div class="text-3xl md:text-4xl lg:text-5xl">
                <LoggerDay {...data} />
            </div>
        </div>
        <div class="md:col-span-12 lg:col-span-12 grid">
            {#key typeId}
                {#if currentLogger}
                    <currentLogger.component {...data} />
                {/if}
            {/key}
        </div>
    </div>
</div> 