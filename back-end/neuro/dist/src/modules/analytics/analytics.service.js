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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverviewAnalytics(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    histories: {
                        orderBy: { date: 'desc' },
                        take: 30,
                    },
                },
            });
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            const totalSessions = user.histories.length;
            const averageScore = totalSessions > 0
                ? user.histories.reduce((sum, h) => sum + h.score, 0) / totalSessions
                : 0;
            const last7Days = user.histories.filter(h => new Date(h.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
            const totalStudyTime = user.histories
                .filter(h => h.duration && h.duration > 0)
                .reduce((sum, h) => sum + (h.duration || 0), 0);
            return {
                totalSessions,
                averageScore: Math.round(averageScore * 100) / 100,
                totalPoints: user.totalPoints || 0,
                currentLevel: user.level || 1,
                currentStreak: user.currentStreak || 0,
                longestStreak: user.longestStreak || 0,
                sessionsThisWeek: last7Days.length,
                totalStudyTimeMinutes: totalStudyTime,
                lastSessionDate: user.lastSessionDate || null,
            };
        }
        catch (error) {
            console.error('Error in getOverviewAnalytics:', error);
            throw new Error(`Error al obtener analytics de overview: ${error.message}`);
        }
    }
    async getEmotionAnalytics(userId) {
        try {
            const histories = await this.prisma.history.findMany({
                where: { userId },
                select: { emotion: true, date: true },
                orderBy: { date: 'desc' },
                take: 50,
            });
            if (histories.length === 0) {
                return {
                    totalSessions: 0,
                    emotionDistribution: [],
                    mostFrequentEmotion: 'N/A',
                };
            }
            const emotionCounts = histories.reduce((acc, h) => {
                if (h.emotion) {
                    acc[h.emotion] = (acc[h.emotion] || 0) + 1;
                }
                return acc;
            }, {});
            const emotionPercentages = Object.entries(emotionCounts).map(([emotion, count]) => ({
                emotion,
                count,
                percentage: Math.round((count / histories.length) * 100),
            }));
            return {
                totalSessions: histories.length,
                emotionDistribution: emotionPercentages,
                mostFrequentEmotion: emotionPercentages.sort((a, b) => b.count - a.count)[0]?.emotion || 'N/A',
            };
        }
        catch (error) {
            console.error('Error in getEmotionAnalytics:', error);
            throw new Error(`Error al obtener analytics de emociones: ${error.message}`);
        }
    }
    async getProgressAnalytics(userId) {
        try {
            const histories = await this.prisma.history.findMany({
                where: { userId },
                select: { score: true, date: true, topic: true },
                orderBy: { date: 'asc' },
            });
            const weeklyProgress = this.groupByWeek(histories);
            const topicProgress = histories.reduce((acc, h) => {
                if (!acc[h.topic]) {
                    acc[h.topic] = { scores: [], averageScore: 0, sessions: 0 };
                }
                acc[h.topic].scores.push(h.score);
                acc[h.topic].sessions++;
                return acc;
            }, {});
            Object.keys(topicProgress).forEach(topic => {
                const scores = topicProgress[topic].scores;
                topicProgress[topic].averageScore =
                    Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100;
            });
            return {
                weeklyProgress,
                topicProgress,
                totalTopics: Object.keys(topicProgress).length,
                bestTopic: Object.entries(topicProgress)
                    .sort(([, a], [, b]) => b.averageScore - a.averageScore)[0]?.[0] || 'N/A',
            };
        }
        catch (error) {
            console.error('Error in getProgressAnalytics:', error);
            throw new Error(`Error al obtener analytics de progreso: ${error.message}`);
        }
    }
    groupByWeek(histories) {
        const weeks = new Map();
        histories.forEach(h => {
            try {
                const date = new Date(h.date);
                const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
                const weekKey = weekStart.toISOString().split('T')[0];
                if (!weeks.has(weekKey)) {
                    weeks.set(weekKey, { scores: [], average: 0, sessions: 0 });
                }
                const week = weeks.get(weekKey);
                week.scores.push(h.score);
                week.sessions++;
            }
            catch (error) {
                console.error('Error processing date in groupByWeek:', error);
            }
        });
        weeks.forEach(week => {
            if (week.scores.length > 0) {
                week.average = Math.round((week.scores.reduce((sum, score) => sum + score, 0) / week.scores.length) * 100) / 100;
            }
        });
        return Array.from(weeks.entries()).map(([week, data]) => ({
            week,
            average: data.average,
            sessions: data.sessions,
        })).sort((a, b) => a.week.localeCompare(b.week));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map