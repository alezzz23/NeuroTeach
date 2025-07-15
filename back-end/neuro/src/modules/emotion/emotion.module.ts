import { Module } from '@nestjs/common';
import { EmotionController } from './emotion.controller';
import { EmotionGateway } from './emotion.gateway';

@Module({
  controllers: [EmotionController],
  providers: [EmotionGateway],
})
export class EmotionModule {}
