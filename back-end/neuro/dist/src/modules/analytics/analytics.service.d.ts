import { PrismaService } from '../../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOverviewAnalytics(userId: number): Promise<{
        totalSessions: number;
        averageScore: number;
        totalPoints: number;
        currentLevel: number;
        currentStreak: number;
        longestStreak: number;
        sessionsThisWeek: number;
        totalStudyTimeMinutes: number;
        lastSessionDate: Date | null;
    }>;
    getEmotionAnalytics(userId: number): Promise<{
        totalSessions: number;
        emotionDistribution: {
            emotion: string;
            count: number;
            percentage: number;
        }[];
        mostFrequentEmotion: string;
    }>;
    getProgressAnalytics(userId: number): Promise<{
        weeklyProgress: {
            week: string;
            average: number;
            sessions: number;
        }[];
        topicProgress: Record<string, {
            scores: number[];
            averageScore: number;
            sessions: number;
        }>;
        totalTopics: number;
        bestTopic: string;
    }>;
    private groupByWeek;
}
