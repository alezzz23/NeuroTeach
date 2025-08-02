import { Module } from '@nestjs/common';
import { VirtualLabsController } from './virtual-labs.controller';
import { VirtualLabsService } from './virtual-labs.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VirtualLabsController],
  providers: [VirtualLabsService],
  exports: [VirtualLabsService],
})
export class VirtualLabsModule {}