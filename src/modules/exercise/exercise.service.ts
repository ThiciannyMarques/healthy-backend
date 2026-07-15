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
    const log = await this.prisma.exerciseLog.create({
      data: {
        profileId,
        didExercise: dto.didExercise,
        loggedAt: new Date(dto.loggedAt),
      },
    });

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
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { loggedAt: 'desc' },
    });
  }
}
