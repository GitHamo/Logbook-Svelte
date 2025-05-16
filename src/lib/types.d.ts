
declare global {
    type LogType = 10 | 20;  // 10: count, 20: toggle

    type Book = {
        id: string;
        name: string;
        log_type: LogType;
        color: string;
    }

    namespace Calendars {
        type Mode = 'mini' | 'md';

        interface Day {
            dayNumber: integer;
            label: string;
            isOwn: boolean;
            value: any | null;
            color: string;
        }

        interface Week {
            label: string;
            days: Day[];
        }

        interface Month {
            label: string;
            weeks: Week[];
        }

        interface Year {
            label: string;
            months: Month[];
        }

        interface YearlyCalendar extends Year { }
    }
}

export type { Book, Calendars, LogType };
