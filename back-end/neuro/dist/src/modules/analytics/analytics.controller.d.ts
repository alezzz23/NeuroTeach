import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getOverview(userId: string): Promise<{
        success: boolean;
        data: {
            totalSessions: number;
            averageScore: number;
            totalPoints: number;
            currentLevel: number;
            currentStreak: number;
            longestStreak: number;
            sessionsThisWeek: number;
            totalStudyTimeMinutes: number;
            lastSessionDate: Date | null;
        };
    }>;
    getEmotions(userId: string): Promise<{
        success: boolean;
        data: {
            totalSessions: number;
            emotionDistribution: {
                emotion: string;
                count: number;
                percentage: number;
            }[];
            mostFrequentEmotion: string;
        };
    }>;
    getProgress(userId: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
}
