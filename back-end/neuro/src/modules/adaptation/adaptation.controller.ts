import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdaptationService, AdaptationRequest, AdaptationResponse } from './adaptation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('adaptation')
export class AdaptationController {
  constructor(private readonly adaptationService: AdaptationService) {}

  @Post('next-step')
  @UseGuards(JwtAuthGuard)
  getNextStep(@Body() data: AdaptationRequest): AdaptationResponse {
    // data: { emotion, performance, context }
    return this.adaptationService.recommendNextStep(data);
  }
}
