import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportUserData(profileId: string) {
    const data = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        medications: { include: { logs: true } },
        hydrationLogs: true,
        weightLogs: true,
        exerciseLogs: true,
      },
    });

    return {
      exportedAt: new Date().toISOString(),
      data,
    };
  }
}
