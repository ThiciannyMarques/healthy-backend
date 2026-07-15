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

  async getHistory(profileId: string): Promise<WeightLog[]> {
    return await this.prisma.weightLog.findMany({
      where: { profileId },
      orderBy: { loggedAt: 'desc' },
      take: 30,
    });
  }
}
