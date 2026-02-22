  import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatarUrl: true,
        preferredLang: true,
        preferredTheme: true,
        totalPoints: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastSessionDate: true,
        achievements: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data: { ...data, role: data['role'] || 'user' } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        totalPoints: true,
        level: true,
        currentStreak: true,
        avatarUrl: true,
      },
    });
  }

  async updateProfile(userId: number, data: {
    name?: string;
    bio?: string;
    avatarUrl?: string;
    preferredLang?: string;
    preferredTheme?: string;
  }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatarUrl: true,
        preferredLang: true,
        preferredTheme: true,
        totalPoints: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastSessionDate: true,
        achievements: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(userId: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  // Leaderboard: top users by points
  async getLeaderboard(limit = 20) {
    return this.prisma.user.findMany({
      orderBy: { totalPoints: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        totalPoints: true,
        level: true,
        currentStreak: true,
      },
    });
  }
}
