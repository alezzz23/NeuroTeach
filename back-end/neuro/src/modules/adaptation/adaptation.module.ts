import { Module } from '@nestjs/common';
import { AdaptationController } from './adaptation.controller';
import { AdaptationService } from './adaptation.service';

@Module({
  controllers: [AdaptationController],
  providers: [AdaptationService],
})
export class AdaptationModule {}
