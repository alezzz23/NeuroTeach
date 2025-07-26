import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    getHistory(userId: string): Promise<{
        userId: string;
        history: {
            id: number;
            difficulty: string;
            emotion: string;
            date: Date;
            topic: string;
            score: number;
            duration: number | null;
            completed: boolean;
            pointsEarned: number;
            userId: number;
            courseId: number | null;
            lessonId: number | null;
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
        difficulty: string;
        emotion: string;
        date: Date;
        topic: string;
        score: number;
        duration: number | null;
        completed: boolean;
        pointsEarned: number;
        userId: number;
        courseId: number | null;
        lessonId: number | null;
    }>;
}
