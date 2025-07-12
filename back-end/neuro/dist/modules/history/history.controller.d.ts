import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    getHistory(userId: string): Promise<{
        userId: string;
        history: {
            emotion: string;
            id: number;
            date: Date;
            topic: string;
            score: number;
            userId: number;
        }[];
    }>;
    addHistory(data: {
        userId: number;
        date: Date;
        topic: string;
        emotion: string;
        score: number;
    }): Promise<{
        emotion: string;
        id: number;
        date: Date;
        topic: string;
        score: number;
        userId: number;
    }>;
}
