// src/modules/weight/weight.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LogWeightDto } from './dto/log-weight.dto';
import { WeightLog } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WeightService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async logWeight(profileId: string, dto: LogWeightDto): Promise<WeightLog> {
    const log = await this.prisma.weightLog.create({
      data: {
        profileId,
        weightKg: dto.weightKg,
        loggedAt: new Date(dto.loggedAt),
      },
    });

    this.eventEmitter.emit('habit.logged', {
      profileId,
      action: 'weight_logged',
    });

    return log;
  }

  async getHistory(
    profileId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<WeightLog[]> {
    const where: any = { profileId };

    if (startDate) {
      where.loggedAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.loggedAt = { ...where.loggedAt, lte: end };
    }

    return await this.prisma.weightLog.findMany({
      where,
      orderBy: { loggedAt: 'desc' },
      take: startDate || endDate ? undefined : 30,
    });
  }
}
