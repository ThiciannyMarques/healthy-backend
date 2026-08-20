import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { HydrationService } from './hydration.service';
import { LogHydrationDto } from './dto/log-hydration.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { HydrationLog } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsOptional, IsDateString } from 'class-validator';

class HydrationHistoryQuery {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('hydration')
export class HydrationController {
  constructor(private readonly hydrationService: HydrationService) {}

  @Post()
  async logConsumption(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LogHydrationDto,
  ): Promise<HydrationLog> {
    return await this.hydrationService.logConsumption(user.profileId, dto);
  }

  @Get('daily')
  async getDailySummary(
    @CurrentUser() user: AuthenticatedUser,
    @Query('date') date: string,
  ): Promise<{ totalMl: number }> {
    return await this.hydrationService.getDailySummary(user.profileId, date);
  }

  @Get('history')
  async getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: HydrationHistoryQuery,
  ): Promise<HydrationLog[]> {
    return await this.hydrationService.getHistory(
      user.profileId,
      query.startDate,
      query.endDate,
    );
  }
}
