import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StreakService {
  constructor(private readonly prisma: PrismaService) {}

  async updateStreak(profileId: string): Promise<void> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: { streakDays: true, updatedAt: true },
    });

    if (!profile) return;

    const lastUpdate = new Date(profile.updatedAt);
    lastUpdate.setUTCHours(0, 0, 0, 0);

    if (lastUpdate.getTime() === yesterday.getTime()) {
      await this.prisma.profile.update({
        where: { id: profileId },
        data: { streakDays: { increment: 1 } },
      });
    } else if (lastUpdate.getTime() < yesterday.getTime()) {
      await this.prisma.profile.update({
        where: { id: profileId },
        data: { streakDays: 1 },
      });
    }
  }
}
