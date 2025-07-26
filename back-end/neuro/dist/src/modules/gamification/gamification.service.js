"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
function parseAchievements(achievements) {
    if (!achievements || !Array.isArray(achievements)) {
        return [];
    }
    return achievements.map(item => {
        if (typeof item === 'object' && item !== null &&
            'id' in item && 'name' in item && 'description' in item && 'icon' in item) {
            return {
                id: String(item.id),
                name: String(item.name),
                description: String(item.description),
                icon: String(item.icon),
                unlockedAt: item.unlockedAt ? new Date(item.unlockedAt) : new Date(),
            };
        }
        return null;
    }).filter((item) => item !== null);
}
let GamificationService = class GamificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    ACHIEVEMENTS_DEFINITIONS = {
        FIRST_SESSION: {
            id: 'FIRST_SESSION',
            name: 'Primera Sesión',
            description: 'Completaste tu primera sesión de estudio',
            icon: '🎯',
            condition: (user) => user.histories.length >= 1,
        },
        CONSISTENT_LEARNER: {
            id: 'CONSISTENT_LEARNER',
            name: 'Estudiante Constante',
            description: 'Mantuviste una racha de 7 días',
            icon: '🔥',
            condition: (user) => user.currentStreak >= 7,
        },
        EMOTIONAL_MASTER: {
            id: 'EMOTIONAL_MASTER',
            name: 'Maestro Emocional',
            description: 'Completaste 10 sesiones con emociones positivas',
            icon: '😊',
            condition: (user) => {
                const positiveEmotions = user.histories.filter((h) => ['feliz', 'motivado', 'concentrado'].includes(h.emotion));
                return positiveEmotions.length >= 10;
            },
        },
        POINT_COLLECTOR: {
            id: 'POINT_COLLECTOR',
            name: 'Coleccionista de Puntos',
            description: 'Acumulaste 500 puntos',
            icon: '💎',
            condition: (user) => user.totalPoints >= 500,
        },
        STUDY_MARATHON: {
            id: 'STUDY_MARATHON',
            name: 'Maratón de Estudio',
            description: 'Estudiaste por más de 300 minutos en total',
            icon: '🏃‍♂️',
            condition: (user) => {
                const totalTime = user.histories
                    .filter((h) => h.duration)
                    .reduce((sum, h) => sum + (h.duration || 0), 0);
                return totalTime >= 300;
            },
        },
    };
    async addPoints(userId, points, reason) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { histories: true },
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const newTotalPoints = user.totalPoints + points;
        const newLevel = this.calculateLevel(newTotalPoints);
        const leveledUp = newLevel > user.level;
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                totalPoints: newTotalPoints,
                level: newLevel,
            },
        });
        const newAchievements = await this.checkAndUnlockAchievements(userId);
        return {
            pointsAdded: points,
            totalPoints: newTotalPoints,
            level: newLevel,
            leveledUp,
            newAchievements,
            reason,
        };
    }
    async updateStreak(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        let newStreak = 1;
        let newLongestStreak = user.longestStreak;
        if (user.lastSessionDate) {
            const lastSession = new Date(user.lastSessionDate);
            const daysDiff = Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
                newStreak = user.currentStreak + 1;
            }
            else if (daysDiff === 0) {
                newStreak = user.currentStreak;
            }
            else {
                newStreak = 1;
            }
        }
        if (newStreak > newLongestStreak) {
            newLongestStreak = newStreak;
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                lastSessionDate: today,
            },
        });
        if (newStreak >= 7) {
            await this.addPoints(userId, 20, `Bonus por racha de ${newStreak} días`);
        }
        return {
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            streakBonus: newStreak >= 7 ? 20 : 0,
        };
    }
    async checkAndUnlockAchievements(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { histories: true },
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const currentAchievements = parseAchievements(user.achievements);
        const unlockedIds = currentAchievements.map(a => a.id);
        const newAchievements = [];
        Object.values(this.ACHIEVEMENTS_DEFINITIONS).forEach(achievement => {
            if (!unlockedIds.includes(achievement.id) && achievement.condition(user)) {
                newAchievements.push({
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    icon: achievement.icon,
                    unlockedAt: new Date(),
                });
            }
        });
        if (newAchievements.length > 0) {
            const updatedAchievements = [...currentAchievements, ...newAchievements];
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    achievements: JSON.parse(JSON.stringify(updatedAchievements)),
                },
            });
            await this.addPoints(userId, newAchievements.length * 50, `Bonus por ${newAchievements.length} logro(s) desbloqueado(s)`);
        }
        return newAchievements;
    }
    async getUserGamificationData(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { histories: true },
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const pointsToNextLevel = this.getPointsToNextLevel(user.totalPoints);
        const progressToNextLevel = this.getProgressToNextLevel(user.totalPoints);
        return {
            totalPoints: user.totalPoints,
            level: user.level,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            achievements: parseAchievements(user.achievements),
            pointsToNextLevel,
            progressToNextLevel,
            totalAchievements: Object.keys(this.ACHIEVEMENTS_DEFINITIONS).length,
            unlockedAchievements: parseAchievements(user.achievements).length,
        };
    }
    calculateLevel(points) {
        return Math.floor(Math.sqrt(points / 100)) + 1;
    }
    getPointsToNextLevel(currentPoints) {
        const currentLevel = this.calculateLevel(currentPoints);
        const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
        return nextLevelPoints - currentPoints;
    }
    getProgressToNextLevel(currentPoints) {
        const currentLevel = this.calculateLevel(currentPoints);
        const currentLevelPoints = Math.pow(currentLevel - 1, 2) * 100;
        const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
        const progress = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map