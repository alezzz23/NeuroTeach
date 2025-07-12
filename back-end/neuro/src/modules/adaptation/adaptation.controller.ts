import { Controller, Post, Body } from '@nestjs/common';
import { AdaptationService } from './adaptation.service';

@Controller('adaptation')
export class AdaptationController {
  constructor(private readonly adaptationService: AdaptationService) {}

  @Post('next-step')
  getNextStep(@Body() data: any) {
    // data: { emotion, performance, context }
    return this.adaptationService.recommendNextStep(data);
  }
}
