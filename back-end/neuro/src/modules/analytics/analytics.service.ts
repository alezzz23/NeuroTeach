import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverviewAnalytics(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          histories: {
            orderBy: { date: 'desc' },
            take: 30, // últimas 30 sesiones
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

    const last7Days = user.histories.filter(
      h => new Date(h.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

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
    } catch (error) {
      console.error('Error in getOverviewAnalytics:', error);
      throw new Error(`Error al obtener analytics de overview: ${error.message}`);
    }
  }

  async getEmotionAnalytics(userId: number) {
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
    }, {} as Record<string, number>);

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
    } catch (error) {
      console.error('Error in getEmotionAnalytics:', error);
      throw new Error(`Error al obtener analytics de emociones: ${error.message}`);
    }
  }

  async getProgressAnalytics(userId: number) {
    try {
      const histories = await this.prisma.history.findMany({
      where: { userId },
      select: { score: true, date: true, topic: true },
      orderBy: { date: 'asc' },
    });

    // Progreso por semana
    const weeklyProgress = this.groupByWeek(histories);
    
    // Progreso por tema
    const topicProgress = histories.reduce((acc, h) => {
      if (!acc[h.topic]) {
        acc[h.topic] = { scores: [], averageScore: 0, sessions: 0 };
      }
      acc[h.topic].scores.push(h.score);
      acc[h.topic].sessions++;
      return acc;
    }, {} as Record<string, { scores: number[], averageScore: number, sessions: number }>);

    // Calcular promedio por tema
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
        .sort(([,a], [,b]) => b.averageScore - a.averageScore)[0]?.[0] || 'N/A',
    };
    } catch (error) {
      console.error('Error in getProgressAnalytics:', error);
      throw new Error(`Error al obtener analytics de progreso: ${error.message}`);
    }
  }

  private groupByWeek(histories: Array<{ score: number; date: Date }>) {
    const weeks = new Map<string, { scores: number[], average: number, sessions: number }>();
    
    histories.forEach(h => {
      try {
        const date = new Date(h.date);
        // Crear una nueva fecha para evitar mutación
        const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeks.has(weekKey)) {
          weeks.set(weekKey, { scores: [], average: 0, sessions: 0 });
        }
        
        const week = weeks.get(weekKey)!;
        week.scores.push(h.score);
        week.sessions++;
      } catch (error) {
        console.error('Error processing date in groupByWeek:', error);
      }
    });

    // Calcular promedios
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
}