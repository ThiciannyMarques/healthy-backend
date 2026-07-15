import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { PrismaService } from '../../database/prisma.service';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('status')
  async getStatus(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: user.profileId },
      select: { currentXp: true, streakDays: true },
    });

    const currentXp = profile?.currentXp || 0;

    const level = Math.floor(currentXp / 100) + 1;

    const xpForNextLevel = level * 100;
    const xpProgressPercentage = Math.round(((currentXp % 100) / 100) * 100);

    return {
      currentXp,
      level,
      streakDays: profile?.streakDays || 0,
      nextLevelGoal: xpForNextLevel,
      progressPercentage: xpProgressPercentage,
    };
  }
}
