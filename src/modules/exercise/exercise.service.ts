import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LogExerciseDto } from './dto/log-exercise.dto';
import { ExerciseLog } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ExerciseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async logExercise(
    profileId: string,
    dto: LogExerciseDto,
  ): Promise<ExerciseLog> {
    const targetDate = new Date(dto.loggedAt);

    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingLog = await this.prisma.exerciseLog.findFirst({
      where: {
        profileId,
        loggedAt: { gte: startOfDay, lte: endOfDay },
      },
    });

    let log: ExerciseLog;

    if (existingLog) {
      log = await this.prisma.exerciseLog.update({
        where: { id: existingLog.id },
        data: {
          didExercise: dto.didExercise,
          durationMinutes: dto.durationMinutes,
        },
      });
    } else {
      log = await this.prisma.exerciseLog.create({
        data: {
          profileId,
          didExercise: dto.didExercise,
          durationMinutes: dto.durationMinutes,
          loggedAt: targetDate,
        },
      });
    }

    if (dto.didExercise) {
      this.eventEmitter.emit('habit.logged', {
        profileId,
        action: 'exercise_completed',
      });
    }

    return log;
  }

  async getDailyStatus(
    profileId: string,
    targetDate: string,
  ): Promise<ExerciseLog | null> {
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return await this.prisma.exerciseLog.findFirst({
      where: {
        profileId,
        loggedAt: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { loggedAt: 'desc' },
    });
  }

  async getHistory(
    profileId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ExerciseLog[]> {
    const where: any = { profileId };

    if (startDate) {
      where.loggedAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.loggedAt = { ...where.loggedAt, lte: end };
    }

    return await this.prisma.exerciseLog.findMany({
      where,
      orderBy: { loggedAt: 'desc' },
      take: startDate || endDate ? undefined : 30,
    });
  }
}
