import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdaptationService } from './adaptation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('adaptation')
export class AdaptationController {
  constructor(private readonly adaptationService: AdaptationService) {}

  @Post('next-step')
  @UseGuards(JwtAuthGuard)
  getNextStep(@Body() data: any) {
    // data: { emotion, performance, context }
    return this.adaptationService.recommendNextStep(data);
  }
}
