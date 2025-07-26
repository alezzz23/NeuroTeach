import { PrismaService } from '../../prisma/prisma.service';
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date;
}
export declare class GamificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly ACHIEVEMENTS_DEFINITIONS;
    addPoints(userId: number, points: number, reason: string): Promise<{
        pointsAdded: number;
        totalPoints: number;
        level: number;
        leveledUp: boolean;
        newAchievements: Achievement[];
        reason: string;
    }>;
    updateStreak(userId: number): Promise<{
        currentStreak: number;
        longestStreak: number;
        streakBonus: number;
    }>;
    checkAndUnlockAchievements(userId: number): Promise<Achievement[]>;
    getUserGamificationData(userId: number): Promise<{
        totalPoints: number;
        level: number;
        currentStreak: number;
        longestStreak: number;
        achievements: Achievement[];
        pointsToNextLevel: number;
        progressToNextLevel: number;
        totalAchievements: number;
        unlockedAchievements: number;
    }>;
    private calculateLevel;
    private getPointsToNextLevel;
    private getProgressToNextLevel;
}
