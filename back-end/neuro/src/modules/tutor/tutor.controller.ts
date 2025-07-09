import { Body, Controller, Post } from '@nestjs/common';
import { TutorService } from './tutor.service';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post('ask')
  async askTutor(
    @Body('prompt') prompt: string,
    @Body('emotion') emotion: string,
  ): Promise<any> {
    return this.tutorService.askTutor(prompt, emotion);
  }
} 