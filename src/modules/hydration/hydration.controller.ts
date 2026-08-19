// src/modules/hydration/hydration.controller.ts
import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { HydrationService } from '../hydration/hydration.service';
import { LogHydrationDto } from '../hydration/dto/log-hydration.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { HydrationLog } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
}
