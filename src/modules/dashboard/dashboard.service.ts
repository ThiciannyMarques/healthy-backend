import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomeSummary(profileId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [hydration, exercise, profile] = await Promise.all([
      this.prisma.hydrationLog.aggregate({
        _sum: { amountMl: true },
        where: { profileId, loggedAt: { gte: today } },
      }),
      this.prisma.exerciseLog.findFirst({
        where: { profileId, loggedAt: { gte: today } },
      }),
      this.prisma.profile.findUnique({
        where: { id: profileId },
        select: { currentXp: true, streakDays: true, name: true },
      }),
    ]);

    return {
      hydration: { current: hydration._sum.amountMl || 0 },
      exercise: { done: !!exercise?.didExercise },
      profile,
    };
  }
}
