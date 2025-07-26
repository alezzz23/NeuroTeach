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
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const gamification_service_1 = require("../gamification/gamification.service");
let HistoryService = class HistoryService {
    prisma;
    gamificationService;
    constructor(prisma, gamificationService) {
        this.prisma = prisma;
        this.gamificationService = gamificationService;
    }
    async getHistoryByUserId(userId) {
        return this.prisma.history.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }
    async addHistory(data) {
        let points = 10;
        if (data.score >= 80)
            points += 15;
        else if (data.score >= 60)
            points += 10;
        else if (data.score >= 40)
            points += 5;
        if (['feliz', 'motivado', 'concentrado'].includes(data.emotion)) {
            points += 5;
        }
        if (data.duration && data.duration >= 30) {
            points += 10;
        }
        const historyData = {
            ...data,
            date: data.date || new Date(),
            difficulty: data.difficulty || 'medium',
            pointsEarned: points,
        };
        const history = await this.prisma.history.create({ data: historyData });
        try {
            await this.gamificationService.addPoints(data.userId, points, 'Sesión completada');
            await this.gamificationService.updateStreak(data.userId);
            await this.gamificationService.checkAndUnlockAchievements(data.userId);
        }
        catch (error) {
            console.error('Error updating gamification:', error);
        }
        return history;
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gamification_service_1.GamificationService])
], HistoryService);
//# sourceMappingURL=history.service.js.map