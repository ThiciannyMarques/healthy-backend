import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LogWeightDto } from './dto/log-weight.dto';
import { WeightLog } from '@prisma/client';

@Injectable()
export class WeightService {
  constructor(private readonly prisma: PrismaService) {}

  async logWeight(profileId: string, dto: LogWeightDto): Promise<WeightLog> {
    return await this.prisma.weightLog.create({
      data: {
        profileId,
        weightKg: dto.weightKg,
        loggedAt: new Date(dto.loggedAt),
      },
    });
  }

  async getHistory(profileId: string): Promise<WeightLog[]> {
    return await this.prisma.weightLog.findMany({
      where: { profileId },
      orderBy: { loggedAt: 'desc' },
      take: 30,
    });
  }
}
