
declare global {
    type LogType = 10 | 20;  // 10: count, 20: toggle

    type Book = {
        id: string;
        name: string;
        log_type: LogType;
        color: string;
    }
}

export type { Book, LogType };

