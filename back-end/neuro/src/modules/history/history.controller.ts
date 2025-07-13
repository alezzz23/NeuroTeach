import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':userId')
  async getHistory(@Param('userId') userId: string) {
    const history = await this.historyService.getHistoryByUserId(Number(userId));
    return { userId, history };
  }

  @Post()
  async addHistory(@Body() data: { userId: number; date: Date; topic: string; emotion: string; score: number }) {
    return this.historyService.addHistory(data);
  }
}
