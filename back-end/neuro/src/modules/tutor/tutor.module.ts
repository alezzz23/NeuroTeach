import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';

@Module({
  controllers: [TutorController],
  providers: [TutorService],
})
export class TutorModule {} 