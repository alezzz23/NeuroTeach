import { PrismaService } from '../../prisma/prisma.service';
export declare class HistoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHistoryByUserId(userId: number): Promise<{
        emotion: string;
        id: number;
        date: Date;
        topic: string;
        score: number;
        userId: number;
    }[]>;
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
