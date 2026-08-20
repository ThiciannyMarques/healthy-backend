import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { LogExerciseDto } from './dto/log-exercise.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ExerciseLog } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsOptional, IsDateString } from 'class-validator';

class ExerciseHistoryQuery {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@UseGuards(JwtAuthGuard)
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

  @Get('history')
  async getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ExerciseHistoryQuery,
  ): Promise<ExerciseLog[]> {
    return await this.exerciseService.getHistory(
      user.profileId,
      query.startDate,
      query.endDate,
    );
  }
}
