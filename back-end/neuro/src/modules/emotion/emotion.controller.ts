import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('emotion')
export class EmotionController {
  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  analyzeEmotion(@Body() data: any) {
    const emotions = ['feliz', 'frustrado', 'aburrido', 'confundido'];
    if (data && data.forceEmotion && emotions.includes(data.forceEmotion)) {
      return { emotion: data.forceEmotion };
    }
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    return { emotion: randomEmotion };
  }
}
