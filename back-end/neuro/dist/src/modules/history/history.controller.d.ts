import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    getHistory(userId: string): Promise<{
        userId: string;
        history: {
            id: number;
            emotion: string;
            date: Date;
            topic: string;
            score: number;
            duration: number | null;
            difficulty: string;
            completed: boolean;
            pointsEarned: number;
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
        id: number;
        emotion: string;
        date: Date;
        topic: string;
        score: number;
        duration: number | null;
        difficulty: string;
        completed: boolean;
        pointsEarned: number;
        userId: number;
    }>;
}
