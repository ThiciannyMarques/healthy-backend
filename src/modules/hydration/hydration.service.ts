import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LogHydrationDto } from './dto/log-hydration.dto';
import { HydrationLog } from '@prisma/client';

@Injectable()
export class HydrationService {
  constructor(private readonly prisma: PrismaService) {}

  async logConsumption(
    profileId: string,
    dto: LogHydrationDto,
  ): Promise<HydrationLog> {
    return await this.prisma.hydrationLog.create({
      data: {
        profileId,
        amountMl: dto.amountMl,
        loggedAt: new Date(dto.loggedAt),
      },
    });
  }

  async getDailySummary(
    profileId: string,
    targetDate: string,
  ): Promise<{ totalMl: number }> {
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const logs = await this.prisma.hydrationLog.aggregate({
      _sum: {
        amountMl: true,
      },
      where: {
        profileId,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return { totalMl: logs._sum.amountMl || 0 };
  }
}
