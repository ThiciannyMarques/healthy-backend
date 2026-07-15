import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LogHydrationDto } from './dto/log-hydration.dto';
import { HydrationLog } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HydrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async logConsumption(
    profileId: string,
    dto: LogHydrationDto,
  ): Promise<HydrationLog> {
    const log = await this.prisma.hydrationLog.create({
      data: {
        profileId,
        amountMl: dto.amountMl,
        loggedAt: new Date(dto.loggedAt),
      },
    });

    this.eventEmitter.emit('habit.logged', {
      profileId,
      action: 'hydration_logged',
    });

    return log;
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
