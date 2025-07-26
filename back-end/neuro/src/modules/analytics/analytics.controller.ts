import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview/:userId')
  async getOverview(@Param('userId') userId: string) {
    const analytics = await this.analyticsService.getOverviewAnalytics(Number(userId));
    return {
      success: true,
      data: analytics,
    };
  }

  @Get('emotions/:userId')
  async getEmotions(@Param('userId') userId: string) {
    const analytics = await this.analyticsService.getEmotionAnalytics(Number(userId));
    return {
      success: true,
      data: analytics,
    };
  }

  @Get('progress/:userId')
  async getProgress(@Param('userId') userId: string) {
    const analytics = await this.analyticsService.getProgressAnalytics(Number(userId));
    return {
      success: true,
      data: analytics,
    };
  }
}