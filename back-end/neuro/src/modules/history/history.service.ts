import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class HistoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
  ) {}

  async getHistoryByUserId(userId: number) {
    return this.prisma.history.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async addHistory(data: { 
    userId: number; 
    date?: Date; 
    topic: string; 
    emotion: string; 
    score: number;
    duration?: number;
    difficulty?: string;
  }) {
    // Calcular puntos basados en el rendimiento
    let points = 10; // Puntos base por completar sesión
    
    if (data.score >= 80) points += 15; // Bonus por buen rendimiento
    else if (data.score >= 60) points += 10;
    else if (data.score >= 40) points += 5;
    
    // Bonus por emociones positivas
    if (['feliz', 'motivado', 'concentrado'].includes(data.emotion)) {
      points += 5;
    }
    
    // Bonus por duración
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
    
    // Actualizar gamificación
    try {
      await this.gamificationService.addPoints(data.userId, points, 'Sesión completada');
      await this.gamificationService.updateStreak(data.userId);
      await this.gamificationService.checkAndUnlockAchievements(data.userId);
    } catch (error) {
      console.error('Error updating gamification:', error);
    }
    
    return history;
  }
}
