import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TutorModule } from './modules/tutor/tutor.module';
import { EmotionModule } from './modules/emotion/emotion.module';
import { UserModule } from './modules/user/user.module';
import { HistoryModule } from './modules/history/history.module';
import { AdaptationModule } from './modules/adaptation/adaptation.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { VirtualLabsModule } from './modules/virtual-labs/virtual-labs.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TutorModule,
    EmotionModule,
    UserModule,
    HistoryModule,
    AdaptationModule,
    AnalyticsModule,
    GamificationModule,
    VirtualLabsModule,
    PrismaModule,
    AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
