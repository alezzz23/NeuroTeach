import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistoryByUserId(userId: number) {
    return this.prisma.history.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async addHistory(data: { userId: number; date: Date; topic: string; emotion: string; score: number }) {
    return this.prisma.history.create({ data });
  }
}
