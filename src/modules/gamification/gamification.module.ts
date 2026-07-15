import { Module } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { GamificationController } from './gamification.controller';
import { StreakService } from './streak.service';

@Module({
  controllers: [GamificationController],
  providers: [GamificationService, StreakService],
})
export class GamificationModule {}
