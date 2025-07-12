import { Module } from '@nestjs/common';
import { EmotionController } from './emotion.controller';

@Module({
  controllers: [EmotionController],
})
export class EmotionModule {}
