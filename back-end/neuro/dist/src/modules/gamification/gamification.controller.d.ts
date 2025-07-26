import { GamificationService, Achievement } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getUserData(userId: string): Promise<{
        success: boolean;
        data: {
            totalPoints: number;
            level: number;
            currentStreak: number;
            longestStreak: number;
            achievements: Achievement[];
            pointsToNextLevel: number;
            progressToNextLevel: number;
            totalAchievements: number;
            unlockedAchievements: number;
        };
    }>;
    addPoints(body: {
        userId: number;
        points: number;
        reason: string;
    }): Promise<{
        success: boolean;
        data: {
            pointsAdded: number;
            totalPoints: number;
            level: number;
            leveledUp: boolean;
            newAchievements: Achievement[];
            reason: string;
        };
    }>;
    updateStreak(body: {
        userId: number;
    }): Promise<{
        success: boolean;
        data: {
            currentStreak: number;
            longestStreak: number;
            streakBonus: number;
        };
    }>;
    checkAchievements(body: {
        userId: number;
    }): Promise<{
        success: boolean;
        data: {
            newAchievements: Achievement[];
            count: number;
        };
    }>;
}
