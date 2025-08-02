import { PrismaService } from '../../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
export declare class HistoryService {
    private readonly prisma;
    private readonly gamificationService;
    constructor(prisma: PrismaService, gamificationService: GamificationService);
    getHistoryByUserId(userId: number): Promise<{
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
    }[]>;
    addHistory(data: {
        userId: number;
        date?: Date;
        topic: string;
        emotion: string;
        score: number;
        duration?: number;
        difficulty?: string;
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
