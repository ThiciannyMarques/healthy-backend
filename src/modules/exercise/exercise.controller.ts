import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { LogExerciseDto } from './dto/log-exercise.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ExerciseLog } from '@prisma/client';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  async logExercise(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LogExerciseDto,
  ): Promise<ExerciseLog> {
    return await this.exerciseService.logExercise(user.profileId, dto);
  }

  @Get('daily')
  async getDailyStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Query('date') date: string,
  ): Promise<ExerciseLog | null> {
    return await this.exerciseService.getDailyStatus(user.profileId, date);
  }
}
