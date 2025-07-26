import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

// Helper function to safely parse achievements from JSON
function parseAchievements(achievements: Prisma.JsonValue): Achievement[] {
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
        unlockedAt: item.unlockedAt ? new Date(item.unlockedAt as string) : new Date(),
      } as Achievement;
    }
    return null;
  }).filter((item): item is Achievement => item !== null);
}

@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly ACHIEVEMENTS_DEFINITIONS = {
    FIRST_SESSION: {
      id: 'FIRST_SESSION',
      name: 'Primera Sesión',
      description: 'Completaste tu primera sesión de estudio',
      icon: '🎯',
      condition: (user: any) => user.histories.length >= 1,
    },
    CONSISTENT_LEARNER: {
      id: 'CONSISTENT_LEARNER',
      name: 'Estudiante Constante',
      description: 'Mantuviste una racha de 7 días',
      icon: '🔥',
      condition: (user: any) => user.currentStreak >= 7,
    },
    EMOTIONAL_MASTER: {
      id: 'EMOTIONAL_MASTER',
      name: 'Maestro Emocional',
      description: 'Completaste 10 sesiones con emociones positivas',
      icon: '😊',
      condition: (user: any) => {
        const positiveEmotions = user.histories.filter(
          (h: any) => ['feliz', 'motivado', 'concentrado'].includes(h.emotion)
        );
        return positiveEmotions.length >= 10;
      },
    },
    POINT_COLLECTOR: {
      id: 'POINT_COLLECTOR',
      name: 'Coleccionista de Puntos',
      description: 'Acumulaste 500 puntos',
      icon: '💎',
      condition: (user: any) => user.totalPoints >= 500,
    },
    STUDY_MARATHON: {
      id: 'STUDY_MARATHON',
      name: 'Maratón de Estudio',
      description: 'Estudiaste por más de 300 minutos en total',
      icon: '🏃‍♂️',
      condition: (user: any) => {
        const totalTime = user.histories
          .filter((h: any) => h.duration)
          .reduce((sum: number, h: any) => sum + (h.duration || 0), 0);
        return totalTime >= 300;
      },
    },
  };

  async addPoints(userId: number, points: number, reason: string) {
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

    // Actualizar puntos y nivel
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: newTotalPoints,
        level: newLevel,
      },
    });

    // Verificar nuevos logros
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

  async updateStreak(userId: number) {
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
        // Sesión consecutiva
        newStreak = user.currentStreak + 1;
      } else if (daysDiff === 0) {
        // Misma fecha, mantener streak
        newStreak = user.currentStreak;
      } else {
        // Se rompió la racha
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

    // Puntos bonus por streak
    if (newStreak >= 7) {
      await this.addPoints(userId, 20, `Bonus por racha de ${newStreak} días`);
    }

    return {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      streakBonus: newStreak >= 7 ? 20 : 0,
    };
  }

  async checkAndUnlockAchievements(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { histories: true },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const currentAchievements = parseAchievements(user.achievements);
    const unlockedIds = currentAchievements.map(a => a.id);
    const newAchievements: Achievement[] = [];

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
          achievements: JSON.parse(JSON.stringify(updatedAchievements)) as Prisma.InputJsonValue,
        },
      });

      // Puntos bonus por logros
      await this.addPoints(userId, newAchievements.length * 50, `Bonus por ${newAchievements.length} logro(s) desbloqueado(s)`);
    }

    return newAchievements;
  }

  async getUserGamificationData(userId: number) {
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

  private calculateLevel(points: number): number {
    // Fórmula: nivel = floor(sqrt(points / 100)) + 1
    return Math.floor(Math.sqrt(points / 100)) + 1;
  }

  private getPointsToNextLevel(currentPoints: number): number {
    const currentLevel = this.calculateLevel(currentPoints);
    const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
    return nextLevelPoints - currentPoints;
  }

  private getProgressToNextLevel(currentPoints: number): number {
    const currentLevel = this.calculateLevel(currentPoints);
    const currentLevelPoints = Math.pow(currentLevel - 1, 2) * 100;
    const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
    const progress = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }
}