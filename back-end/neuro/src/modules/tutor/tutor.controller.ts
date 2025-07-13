import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post('ask')
  @UseGuards(JwtAuthGuard)
  async askTutor(
    @Body('prompt') prompt: string,
    @Body('emotion') emotion: string,
  ): Promise<any> {
    return this.tutorService.askTutor(prompt, emotion);
  }
} 