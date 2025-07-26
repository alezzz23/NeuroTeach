import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GamificationService, Achievement } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('user/:userId')
  async getUserData(@Param('userId') userId: string) {
    const data = await this.gamificationService.getUserGamificationData(Number(userId));
    return {
      success: true,
      data,
    };
  }

  @Post('points')
  async addPoints(
    @Body() body: { userId: number; points: number; reason: string }
  ) {
    const result = await this.gamificationService.addPoints(
      body.userId,
      body.points,
      body.reason
    );
    return {
      success: true,
      data: result,
    };
  }

  @Post('streak')
  async updateStreak(@Body() body: { userId: number }) {
    const result = await this.gamificationService.updateStreak(body.userId);
    return {
      success: true,
      data: result,
    };
  }

  @Post('achievements/check')
  async checkAchievements(@Body() body: { userId: number }) {
    const newAchievements = await this.gamificationService.checkAndUnlockAchievements(body.userId);
    return {
      success: true,
      data: {
        newAchievements,
        count: newAchievements.length,
      },
    };
  }
}